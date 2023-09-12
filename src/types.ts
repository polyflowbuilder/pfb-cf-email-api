import { EmailIdentifier } from './schemas/email';

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
