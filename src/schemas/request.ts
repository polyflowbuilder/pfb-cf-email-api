import { z } from 'zod';

export const requestBodySchema = z.object({
  signature: z.string({
    required_error: 'Signature is required.'
  }),
  data: z.string({
    required_error: 'Data is required.'
  })
});
