import { EmailIdentifier } from './schemas/email';

export interface CFWorkerEnv {
  // symmetric key to verify signed request
  SIGNATURE_KEY: string;

  // Mailchannels parameters for DKIM email signing
  DKIM_DOMAIN: string;
  DKIM_SELECTOR: string;
  DKIM_PRIVATE_KEY: string;

  // Resend parameters for email sending
  RESEND_API_KEY: string;
}

export interface Email {
  to: EmailIdentifier[];
  from: EmailIdentifier;
  subject: string;
  contentHTML: string;
}
