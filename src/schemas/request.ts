import * as z from 'zod';
import { getRequiredFieldError } from './util';

export const requestBodySchema = z.object({
  signature: z.string({
    error: (issue) => getRequiredFieldError('Signature', issue)
  }),
  data: z.string({
    error: (issue) => getRequiredFieldError('Data', issue)
  })
});
