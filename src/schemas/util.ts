import * as z from 'zod';

export const getRequiredFieldError = (fieldName: string, issue: z.core.$ZodRawIssue): string => {
  if (issue.input === undefined) {
    return `${fieldName} field is required.`;
  }
  return `${fieldName} field is invalid.`;
};
