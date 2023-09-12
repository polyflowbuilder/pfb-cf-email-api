import { z } from 'zod';

export const feedbackTemplateSchema = z.object({
  name: z.literal('feedback'),
  data: z.object({
    subject: z.string({
      required_error: 'Subject field is required.'
    }),
    returnEmail: z
      .string()
      .email({
        message: 'Email field is not a valid email.'
      })
      .optional(),
    feedbackContent: z.string({
      required_error: 'Feedback field is required.'
    })
  })
});
