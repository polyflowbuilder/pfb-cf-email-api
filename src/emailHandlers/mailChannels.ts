import type { CFWorkerEnv, Email } from './../types';

// email handler used to interface with the Mailchannels API
// (free use now discontinued for Cloudflare Workers users)
// reference: https://support.mailchannels.com/hc/en-us/articles/26814255454093-End-of-Life-Notice-Cloudflare-Workers

export async function sendEmail(env: CFWorkerEnv, email: Email, dryRun: boolean): Promise<boolean> {
  try {
    // form request
    const emailRequest = new Request(
      `https://api.mailchannels.net/tx/v1/send${dryRun ? '?dry-run=true' : ''}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: email.to,
              dkim_domain: env.DKIM_DOMAIN,
              dkim_selector: env.DKIM_SELECTOR,
              dkim_private_key: env.DKIM_PRIVATE_KEY
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
      }
    );

    // send email
    const res = await fetch(emailRequest);
    console.log('email status:', res.status);
    if (res.status === 500 || res.status === 200) {
      const json = await res.json();
      console.error('Mailchannels endpoint responded with json', json);
    }
    return res.status === 202 || res.status === 200;
  } catch (error) {
    console.error('sendEmail: an unexpected error occurred', error);
    return false;
  }
}
