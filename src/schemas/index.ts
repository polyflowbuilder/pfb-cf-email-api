import { z } from 'zod';
import { emailIdentifierSchema } from './email';

export const payloadSchema = z.object({
  expiry: z.number({
    required_error: 'Expiry field in milliseconds is required.'
  }),
  to: emailIdentifierSchema,
  from: emailIdentifierSchema,
  subject: z.string({
    required_error: 'Subject field is required.'
  })
});
