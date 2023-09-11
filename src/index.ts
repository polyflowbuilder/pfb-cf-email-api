// entrypoint for worker

import { verifyRequest } from './auth';

export interface Env {
  // symmetric key to verify signed request
  SIGNATURE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      if (request.method !== 'POST') {
        return new Response('Invalid method.', {
          status: 400
        });
      }

      // authenticate request using HMAC signature
      const requestBody = (await request.json()) as Record<string, unknown>;
      const verified = await verifyRequest(requestBody, env.SIGNATURE_KEY);
      if (!verified) {
        return new Response('Request is invalid.', {
          status: 403
        });
      }

      const payload = JSON.parse(requestBody.data as string);
      return new Response(`Request is valid. Payload:\n${JSON.stringify(payload, null, 2)}\n`);
    } catch (error) {
      console.error('an error occurred during worker processing:', error);
      return new Response('Internal Server Error', {
        status: 500
      });
    }
  }
};
