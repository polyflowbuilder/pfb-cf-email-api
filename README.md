# PolyFlowBuilder Cloudflare Email API Service

## About

This repository contains the source code for PolyFlowBuilder's email API, which exists in the form of a Cloudflare Worker.

## Why use Cloudflare for Email?

Historically, PolyFlowBuilder was hosted on a paid platform that included email services (more specifically, an SMTP relay server to reliably send emails). This platform was where all duncanapple.io projects lived (hence why PolyFlowBuilder was always located at https://polyflowbuilder.duncanapple.io).

As PolyFlowBuilder is being migrated to its own independent platform (e.g. migrating off the duncanapple.io domain, etc.), a new mail service was needed.

At first, it was considered to create a custom mail server system for PolyFlowBuilder (e.g. custom inboxes, SMTP servers, mail servers, mail antivirus, etc.). Any sane person will tell you that rolling a custom email system is not worth it due to the high complexity and high likelihood of being blacklisted (and thus your emails are sent to spam, which would not be good for PolyFlowBuilder's password reset emails!).

Therefore, a variety of email service providers (ESPs) were considered, but they were all either:

- a. too expensive for PolyFlowBuilder's scale
- b. had limitations that weren't acceptable for PolyFlowBuilder (e.g. domain limits, harsh free tier limits, mandatory email/link tracking, poor APIs, etc.)
- c. not meant for the types of emails PolyFlowBuilder sends to users ("transactional" emails, a majority of ESPs are email marketing/campaign-based only)

Throughout this research, a third option was discovered. In May 2022, [Cloudflare announced a partnership with Mailchannels](https://community.cloudflare.com/t/send-email-from-workers-using-mailchannels-for-free/361973), which is an enterprise-level ESP that manages email sending for hosting providers (to give you an idea of their scale). This partnership allows emails to be sent via Mailchannel's services **for free** on a Cloudflare Worker with **custom domains** (after being configured correctly) for up to **100,000 emails per day**.

This option is perfect for PolyFlowBuilder's use, as:

- a. PolyFlowBuilder is on the Cloudflare network already (as part of other migration efforts)
- b. This allows a custom solution to be rolled that handles PolyFlowBuilder's email use cases
- c. There is no loss in functionality/features between the existing email solution and this one

Therefore, this service was born. The Cloudflare worker in this repository takes advantage of this Mailchannels partnership to manage PolyFlowBuilder's email capabilities.

## Maintainers

- @AGuyWhoIsBored ([Bitbucket](https://bitbucket.org/AGuyWhoIsBored), [GitHub](https://github.com/AGuyWhoIsBored), [LinkedIn](https://linkedin.com/in/dapplegarth))
