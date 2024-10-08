// entrypoint for worker
import feedbackTemplate from './templates/feedback.ejs';
import resetPasswordTemplate from './templates/resetpw.ejs';
import { sendEmail } from './emailHandlers/resend';
import { verifyRequest } from './auth';
import { payloadSchema } from './schemas/payload';
import { requestBodySchema } from './schemas/request';
import type { CFWorkerEnv } from './types';

const availableTemplates = new Map([
  ['feedback', feedbackTemplate],
  [
    'resetpw',
    // need to relax type here
    (input: Record<string, string>) =>
      resetPasswordTemplate({
        resetLink: `http://${input.domain}/resetpassword?email=${encodeURIComponent(
          input.email
        )}&token=${encodeURIComponent(input.token)}`
      })
  ]
]);

export default {
  async fetch(request: Request, env: CFWorkerEnv): Promise<Response> {
    try {
      if (request.method !== 'POST') {
        return Response.json(
          {
            message: 'Invalid method.'
          },
          {
            status: 400
          }
        );
      }
      if (request.headers.get('Content-Type') !== 'application/json') {
        return Response.json(
          {
            message: 'Invalid Content-Type header.'
          },
          {
            status: 400
          }
        );
      }

      // validate request body
      const requestBody = await request.json();
      const requestBodyParseResults = requestBodySchema.safeParse(requestBody);
      if (!requestBodyParseResults.success) {
        const { fieldErrors: validationErrors } = requestBodyParseResults.error.flatten();
        return Response.json(
          {
            message: 'Request validation failed.',
            validationErrors
          },
          {
            status: 400
          }
        );
      }

      // authenticate request using HMAC signature
      const verified = await verifyRequest(requestBodyParseResults.data, env.SIGNATURE_KEY);
      if (!verified) {
        return Response.json(
          {
            message: 'Request signature/payload combination is invalid.'
          },
          {
            status: 403
          }
        );
      }

      // get and validate payload from request
      const payloadParseResults = payloadSchema.safeParse(
        JSON.parse(requestBodyParseResults.data.data)
      );
      if (!payloadParseResults.success) {
        const { fieldErrors: validationErrors } = payloadParseResults.error.flatten();
        return Response.json(
          {
            message: 'Request payload validation failed.',
            validationErrors
          },
          {
            status: 400
          }
        );
      }

      // construct email content
      const emailContentBuilder = availableTemplates.get(payloadParseResults.data.template.name);
      if (!emailContentBuilder) {
        throw new Error(
          `unable to find template builder function for email type ${payloadParseResults.data.template.name}`
        );
      }
      const renderedEmailContent = emailContentBuilder(payloadParseResults.data.template.data);

      // send email
      console.log('Attempting to send email of type', payloadParseResults.data.template.name);
      const url = new URL(request.url);

      // use a specific email provider to send emails
      const res = await sendEmail(
        env,
        {
          to: [payloadParseResults.data.to],
          from: payloadParseResults.data.from,
          subject: payloadParseResults.data.subject,
          contentHTML: renderedEmailContent
        },
        url.searchParams.get('dryrun') === 'true'
      );

      if (!res) {
        return Response.json(
          {
            message: 'Email failed to send, please try again later.'
          },
          {
            status: 500
          }
        );
      }
      return Response.json({
        message: 'Email sent successfully.'
      });
    } catch (error) {
      console.error('an error occurred during worker processing:', error);
      return Response.json(
        {
          message: 'Internal Server Error'
        },
        {
          status: 500
        }
      );
    }
  }
};
