import { EmailIdentifier } from './schemas/email';

export interface CFWorkerEnv {
  // symmetric key to verify signed request
  SIGNATURE_KEY: string;

  // parameters for DKIM email signing
  DKIM_DOMAIN: string;
  DKIM_SELECTOR: string;
  DKIM_PRIVATE_KEY: string;
}

export interface DKIM {
  domain: string;
  selector: string;
  privateKeyBase64: string;
}

export interface Email {
  to: EmailIdentifier[];
  from: EmailIdentifier;
  subject: string;
  contentHTML: string;
  signature: DKIM;
}
