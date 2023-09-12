// entrypoint for worker
import feedbackTemplate from './templates/feedback.ejs';
import { sendEmail } from './emailHandler';
import { verifyRequest } from './auth';
import { payloadSchema } from './schemas/payload';
import { requestBodySchema } from './schemas/request';

const availableTemplates = new Map([['feedback', feedbackTemplate]]);

export interface Env {
  // symmetric key to verify signed request
  SIGNATURE_KEY: string;

  // parameters for DKIM email signing
  DKIM_DOMAIN: string;
  DKIM_SELECTOR: string;
  DKIM_PRIVATE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      if (request.method !== 'POST') {
        return new Response('Invalid method.', {
          status: 400
        });
      }
      if (request.headers.get('Content-Type') !== 'application/json') {
        return new Response('Invalid content.', {
          status: 400
        });
      }

      // validate request body
      const requestBody = await request.json();
      const requestBodyParseResults = requestBodySchema.safeParse(requestBody);
      if (!requestBodyParseResults.success) {
        const { fieldErrors: validationErrors } = requestBodyParseResults.error.flatten();
        return new Response(
          JSON.stringify({
            message: 'Request validation failed.',
            validationErrors
          }),
          {
            status: 400
          }
        );
      }

      // authenticate request using HMAC signature
      const verified = await verifyRequest(requestBodyParseResults.data, env.SIGNATURE_KEY);
      if (!verified) {
        return new Response('Request signature/payload combination is invalid.', {
          status: 403
        });
      }

      // get and validate payload from request
      const payloadParseResults = payloadSchema.safeParse(requestBodyParseResults.data);
      if (!payloadParseResults.success) {
        const { fieldErrors: validationErrors } = payloadParseResults.error.flatten();
        return new Response(
          JSON.stringify({
            message: 'Request payload validation failed.',
            validationErrors
          }),
          {
            status: 400
          }
        );
      }

      // construct email content
      const emailContentBuilder = availableTemplates.get(payloadParseResults.data.template.name);
      if (!emailContentBuilder) {
        throw new Error(
          `unable to find template for email type ${payloadParseResults.data.template.name}`
        );
      }
      const renderedEmailContent = emailContentBuilder(payloadParseResults.data.template.data);

      // send email
      console.log('Sending email of type', payloadParseResults.data.template.name);
      await sendEmail({
        to: [payloadParseResults.data.to],
        from: payloadParseResults.data.from,
        subject: payloadParseResults.data.subject,
        contentHTML: renderedEmailContent,
        signature: {
          domain: env.DKIM_DOMAIN,
          selector: env.DKIM_SELECTOR,
          privateKeyBase64: env.DKIM_PRIVATE_KEY
        }
      });
      return new Response('email sent');
    } catch (error) {
      console.error('an error occurred during worker processing:', error);
      return new Response('Internal Server Error', {
        status: 500
      });
    }
  }
};
