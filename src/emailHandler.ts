import type { Email } from './types';

export async function sendEmail(email: Email): Promise<boolean> {
  try {
    // form request
    const emailRequest = new Request('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: email.to,
            dkim_domain: email.signature.domain,
            dkim_selector: email.signature.selector,
            dkim_private_key: email.signature.privateKeyBase64
          }
        ],
        from: email.from,
        subject: email.subject,
        content: [
          {
            type: 'text/html',
            value: email.contentHTML
          }
        ]
      })
    });

    // send email
    const res = await fetch(emailRequest);
    console.log('email status:', res.status);
    if (res.status === 500) {
      const json = await res.json();
      console.error('Mailchannels endpoint responded with 500', json);
    }
    return res.status === 202;
  } catch (error) {
    console.error('sendEmail: an unexpected error occurred', error);
    return false;
  }
}
