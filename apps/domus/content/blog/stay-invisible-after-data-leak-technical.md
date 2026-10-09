---
title: "Stay Invisible After a Data Leak (Technical)"
description: "An OIDC-oriented explanation of how Janus email masking reduces post-breach identity correlation."
pubDate: "2026-03-18"
heroImage: "/images/lagoon-1.svg"
---

## Threat model: post-breach correlation

Even when you are not reusing passwords, privacy risk persists after a breach. When attackers obtain a dump of a relying party (RP) database, they commonly attempt to:

- correlate leaked records to real-world identities
- link the same user across multiple services
- trigger account recovery flows using exposed identifiers

In many systems, email becomes a primary correlation key because it is both stable and widely shared across web properties.

## Example flow (OIDC + Janus + email masking)

Consider a user integrating a website via **OIDC** (OpenID Connect), with Janus acting as the identity layer.

1. The user authenticates to the RP using an OIDC authorization flow.
2. Janus issues an RP-scoped identity, enabling **email masking**.
3. The RP stores the email-like identifier it receives (the masked/proxied email for that connection).

From the RP's point of view, the login works like any other OIDC-based sign-in. The difference is that the RP does not receive the user's canonical inbox identity.

## What attackers get in a leak

Assume the RP is breached and the attacker gains access to its stored user records.

If email masking was enabled for the Janus-proxied connection, the leaked dataset contains the **masked/proxied email identifier** (the value scoped to the RP connection), not the user's real email address.

That changes what an attacker can do:

- They have a useful identifier, but not the user's canonical inbox identity.
- They cannot straightforwardly use the leaked email as a universal join key across unrelated services.
- Cross-site correlation becomes materially less reliable because the masked value is not directly reusable for other account linkages.

## Why this reduces “invisibility” loss

Correlation attacks after a breach often rely on stable identifiers that can be re-used for discovery or recovery. By constraining which identity attribute is exposed to the RP in the first place (via the OIDC exchange mediated by Janus), email masking reduces the likelihood that a single breached dataset is enough to map the user to their other accounts.

In short: one leak yields a less reusable identity token, which limits practical traceability.
