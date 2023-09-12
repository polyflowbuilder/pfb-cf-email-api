import { z } from 'zod';

export const resetPasswordTemplateSchema = z.object({
  name: z.literal('resetpw'),
  data: z.object({
    email: z
      .string({
        required_error: 'Email field is required.'
      })
      .email({
        message: 'Email field is not a valid email.'
      }),
    token: z.string({
      required_error: 'Token field is required.'
    }),
    domain: z.string({
      required_error: 'Domain field is required.'
    })
  })
});
