import * as z from 'zod';
import { getRequiredFieldError } from '../util';

export const feedbackTemplateSchema = z.object({
  name: z.literal('feedback'),
  data: z.object(
    {
      subject: z.string({
        error: (issue) => getRequiredFieldError('Subject', issue)
      }),
      returnEmail: z.email('Email field is not a valid email.').optional(),
      feedbackContent: z.string({
        error: (issue) => getRequiredFieldError('Feedback', issue)
      })
    },
    {
      error: (issue) => getRequiredFieldError('Template data', issue)
    }
  )
});
