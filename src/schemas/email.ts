import { z } from 'zod';

export const emailIdentifierSchema = z.object(
  {
    email: z
      .string({
        required_error: 'Email field is required.'
      })
      .email({
        message: 'Email field is not a valid email.'
      }),
    name: z.string().optional()
  },
  {
    required_error: 'Email identifier is required.'
  }
);

export type EmailIdentifier = z.infer<typeof emailIdentifierSchema>;
