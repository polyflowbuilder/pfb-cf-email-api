import * as z from 'zod';
import { getRequiredFieldError } from '../util';

export const resetPasswordTemplateSchema = z.object({
  name: z.literal('resetpw'),
  data: z.object({
    email: z.email({
      error: (issue) => getRequiredFieldError('Email', issue)
    }),
    token: z.string({
      error: (issue) => getRequiredFieldError('Token', issue)
    }),
    domain: z.string({
      error: (issue) => getRequiredFieldError('Domain', issue)
    })
  })
});
