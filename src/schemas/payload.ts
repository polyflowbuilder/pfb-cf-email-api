import * as z from 'zod';
import { getRequiredFieldError } from './util';
import { emailIdentifierSchema } from './email';
import { feedbackTemplateSchema } from './templates/feedback';
import { resetPasswordTemplateSchema } from './templates/resetpw';

export const payloadSchema = z.object({
  expiry: z
    .number({
      error: (issue) => getRequiredFieldError('Expiry (ms)', issue)
    })
    .refine((expiryInMilliseconds) => {
      return Date.now() < expiryInMilliseconds;
    }, 'Request has expired.'),
  to: emailIdentifierSchema,
  from: emailIdentifierSchema,
  subject: z.string({
    error: (issue) => getRequiredFieldError('Subject', issue)
  }),
  template: z.discriminatedUnion('name', [feedbackTemplateSchema, resetPasswordTemplateSchema], {
    error: (issue) => {
      console.log('issue', issue);
      if (issue.code === 'invalid_union') {
        return 'Template name field is missing or invalid.';
      }
      return getRequiredFieldError('Template', issue);
    }
  })
});
