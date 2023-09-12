import { z } from 'zod';
import { emailIdentifierSchema } from './email';
import { feedbackTemplateSchema } from './feedback';

export const payloadSchema = z.object({
  expiry: z
    .number({
      required_error: 'Expiry field in milliseconds is required.'
    })
    .refine((expiryInMilliseconds) => {
      Date.now() > expiryInMilliseconds;
    }, 'Request has expired.'),
  to: emailIdentifierSchema,
  from: emailIdentifierSchema,
  subject: z.string({
    required_error: 'Subject field is required.'
  }),
  template: z.discriminatedUnion('name', [feedbackTemplateSchema], {
    required_error: 'Template field is required.'
  })
});
