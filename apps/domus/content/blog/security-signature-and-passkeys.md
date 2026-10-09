---
title: "Security Signature: a shared secret visual, passkeys, and phishing"
description: "How Janus combines a deterministic visual anti-phishing identifier with passkeys and email-safe checks when open-source UIs are easy to clone."
pubDate: "2026-04-04"
heroImage: "/images/lagoon-1.svg"
---

## The problem: identity pages are easy to fake

Phishing against identity providers usually looks like this: you land on a page that _feels_ like Janus—same layout, same copy, same buttons—but it is hosted on an attacker-controlled domain. If you enter credentials or approve a step there, you have handed something useful to the wrong party.

That risk is not theoretical for open products. When the real UI is **open source**, a motivated attacker can **clone the look and feel** with little guesswork. Visual parity alone does not prove you are on the legitimate origin.

## What the Security Signature is

Janus shows a **Security Signature**: a **shared secret visual** that acts as a **deterministic visual anti-phishing identifier**.

In plain terms:

- It is **stable for your account**—the same user sees the same pattern over time on genuine Janus surfaces.
- It is **derived on the server** from your identity and a **server-side secret** an attacker does not possess, so a static clone of our CSS cannot invent the correct graphic for _your_ account.
- It is **safe to treat as a fingerprint you recognize**, not as something you paste into chat or share publicly (treat it like a personal “seal” you compare, not a second password).

You first meet this visual during onboarding so your brain has a reference before you rely on it under stress.

## Where passkeys come in

**Passkeys (WebAuthn)** are bound to the **real relying party**: the browser enforces **domain / RP ID** matching. On the **authentic Janus origin**, your passkey ceremony completes; on a **lookalike site** on another hostname, the same passkey flow **does not** authenticate you to the real Janus RP.

When you are signing in with a passkey on the **correct site**, that is the **strongest** signal in the stack: cryptography and the platform, not your eyes alone.

The Security Signature does not replace passkeys. It **complements** them for moments when passkeys are not in play—or when you want a quick human check before you even start a ceremony.

## Open source: more clone surface, more need for depth

We believe in open development. The trade-off is honest: **visible source makes copying the shell trivial**. Defense has to be **layered**:

- **Domain-bound passkeys** for interactive sign-in on the real site.
- A **non-leakable server-derived visual** that clones cannot reproduce per user without our secrets.
- Clear **messaging** so users know what to expect and where to look.

No single layer wins every scenario; together they narrow the attacker’s window.

## Email: passkeys do not run in the inbox

You cannot complete WebAuthn inside a typical mail client. Yet **email remains a major phishing channel**: “click here to verify” with a disguised link.

Janus can still help there:

- **Legitimate Janus emails** can include or reference the **same deterministic visual** (for example via an image served from our canonical signature endpoint—see below).
- Before you trust a link, you can **compare** what you see in the message to what you see after you reach Janus on a **known-good URL** you typed or bookmarked.

**Limits, stated clearly:** HTML email can be forged; sender display names lie. The visual is **not magic**. It is most useful when the image is loaded from **our** infrastructure and you **cross-check** against a session you opened on the real domain. When in doubt, do not click—open Janus directly.

## For developers: deterministic visual API

Internally we store a stable public fingerprint derived from the user id and server-side material so the raw id never appears in URLs.

**Endpoint (SVG):**

`https://signature.getjanus.eu/v1/{hash}.svg`

- `{hash}` is the **public fingerprint** for that user—**not** the raw user id.
- Responses are **deterministic** for a given hash: suitable for **CDN caching** and **long-lived clients**.
- **Idempotent:** repeated GETs describe the same visual identity for that hash until you rotate server secrets (a rare, deliberate operation documented in ops runbooks).

Use this when you want mail clients, dashboards, or mobile embeds to show the **same** graphic users learn during registration—without exposing internal identifiers.

## Takeaways

1. **Cloned open-source UIs** raise phishing risk; assume lookalikes exist.
2. **Passkeys** anchor trust to the **real domain** when you use them on that origin.
3. The **Security Signature** is a **deterministic visual anti-phishing identifier** for human verification—especially where **email** and **static pages** still matter.
4. Integrators can rely on **`https://signature.getjanus.eu/v1/{hash}.svg`** for a stable, cache-friendly SVG keyed only by the public hash.

If you are building on Janus, wire the visual into onboarding and docs so your users know what “real” is supposed to look like—then keep passkeys front and center for sign-in itself.
