# PolyFlowBuilder Cloudflare Email API Service

## About

This repository contains the source code for PolyFlowBuilder's email API, which exists in the form of a Cloudflare Worker.

## Why use Cloudflare for Email?

Historically, PolyFlowBuilder was hosted on a paid platform that included email services (more specifically, an SMTP relay server to reliably send emails). This platform was where all duncanapple.io projects lived (hence why PolyFlowBuilder was always located at https://polyflowbuilder.duncanapple.io).

As PolyFlowBuilder is being migrated to its own independent platform (e.g. migrating off the duncanapple.io domain, etc.), a new mail service was needed.

At first, it was considered to create a custom mail server system for PolyFlowBuilder (e.g. custom inboxes, SMTP servers, mail servers, mail antivirus, etc.). Any sane person will tell you that rolling a custom email system is not worth it due to the high complexity and high likelihood of being blacklisted (and thus your emails are sent to spam, which would not be good for PolyFlowBuilder's password reset emails!).

Therefore, a variety of email service providers (ESPs) were considered, but they were all either:

- Too expensive for PolyFlowBuilder's scale
- Had limitations that weren't acceptable for PolyFlowBuilder (e.g. domain limits, harsh free tier limits, mandatory email/link tracking, poor APIs, etc.)
- Not meant for the types of emails PolyFlowBuilder sends to users ("transactional" emails, a majority of ESPs are email marketing/campaign-based only)

Therefore, after lots of research, the [Resend](https://resend.com) platform was selceted to send PolyFlowBuilder's transactional emails. They have a large enough free quota which will satisfy PolyFlowBuilder's needs today, and it is developer friendly which allows the customizability that we require.

Using Cloudflare Workers and Resend is perfect for PolyFlowBuilder's use, as:

- PolyFlowBuilder is on the Cloudflare network already (as part of other migration efforts)
- This allows a custom solution to be rolled that handles PolyFlowBuilder's email use cases
- There is no loss in functionality/features between the existing email solution and this one
- Using a Cloudflare Worker + email provider (Resend in this case) allows us to easily switch out email providers if necessary in the future

Therefore, this service was born.

## Maintainers

- @AGuyWhoIsBored ([Bitbucket](https://bitbucket.org/AGuyWhoIsBored), [GitHub](https://github.com/AGuyWhoIsBored), [LinkedIn](https://linkedin.com/in/dapplegarth))

### Footnotes

1. Previously, this service took advantage of the [Cloudflare partnership with Mailchannels](https://community.cloudflare.com/t/send-email-from-workers-using-mailchannels-for-free/361973) announced in May 2022. A Cloudflare Worker was specifically required for this use case because this was the only integration supported by the Cloudflare and Mailchannels partnership. However, this service has been [discontinued and deactivated as of August 2024](https://support.mailchannels.com/hc/en-us/articles/26814255454093-End-of-Life-Notice-Cloudflare-Workers), so another email provider was required. The Cloudflare Worker here still works perfectly fine, so we keep it around.
