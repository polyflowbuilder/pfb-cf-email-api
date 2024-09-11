import { Resend } from 'resend';
import type { CreateEmailOptions } from 'resend';
import type { CFWorkerEnv, Email } from './../types';

// email handler used to interface with the Resend API

export async function sendEmail(env: CFWorkerEnv, email: Email, dryRun: boolean): Promise<boolean> {
  try {
    // skip sending email for dry-run
    // TODO: call API with dry-run option when it has one
    if (dryRun) {
      console.log('Skipping API call for dry-run request. Payload:', email);
      return true;
    }

    const resendClient = new Resend(env.RESEND_API_KEY);

    // construct request
    const emailRequest: CreateEmailOptions = {
      from: email.from.name ? `${email.from.name} <${email.from.email}>` : email.from.email,
      to: email.to.map((identifier) => identifier.email),
      subject: email.subject,
      html: email.contentHTML
    };

    // send email
    const { data, error } = await resendClient.emails.send(emailRequest);

    if (data) {
      console.log(`Email sent successfully with id=${data.id}`);
      return true;
    }

    // error will always be nonnull at this point
    console.log(`Email failed to send: name=${error?.name}, message=${error?.message}`);
    return false;
  } catch (error) {
    console.error('sendEmail: an unexpected error occurred', error);
    return false;
  }
}
