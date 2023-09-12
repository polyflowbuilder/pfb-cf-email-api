import { z } from 'zod';
import { emailIdentifierSchema } from './email';
import { feedbackTemplateSchema } from './templates/feedback';
import { resetPasswordTemplateSchema } from './templates/resetpw';

export const payloadSchema = z.object({
  expiry: z
    .number({
      required_error: 'Expiry field in milliseconds is required.'
    })
    .refine((expiryInMilliseconds) => {
      return Date.now() < expiryInMilliseconds;
    }, 'Request has expired.'),
  to: emailIdentifierSchema,
  from: emailIdentifierSchema,
  subject: z.string({
    required_error: 'Subject field is required.'
  }),
  template: z.discriminatedUnion('name', [feedbackTemplateSchema, resetPasswordTemplateSchema], {
    errorMap: (issue, ctx) => {
      console.log('issue', issue);
      if (issue.code === z.ZodIssueCode.invalid_union_discriminator) {
        return {
          message: 'Template name field is missing or invalid.'
        };
      }
      if (issue.code === z.ZodIssueCode.invalid_type && ctx.data === undefined) {
        return {
          message: 'Template field is required.'
        };
      }

      return {
        message: ctx.defaultError
      };
    }
  })
});
