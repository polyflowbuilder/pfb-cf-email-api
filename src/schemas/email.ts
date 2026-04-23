import * as z from 'zod';
import { getRequiredFieldError } from './util';

export const emailIdentifierSchema = z.object(
  {
    email: z.email('Email field is not a valid email.'),
    name: z.string().optional()
  },
  {
    error: (issue) => getRequiredFieldError('Email identifier', issue)
  }
);

export type EmailIdentifier = z.infer<typeof emailIdentifierSchema>;
