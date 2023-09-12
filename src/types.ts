export interface DKIM {
  domain: string;
  selector: string;
  privateKeyBase64: string;
}

export interface EmailIdentifier {
  email: string;
  name?: string;
}

export interface Email {
  to: EmailIdentifier[];
  from: EmailIdentifier;
  subject: string;
  contentHTML: string;
  signature: DKIM;
}
