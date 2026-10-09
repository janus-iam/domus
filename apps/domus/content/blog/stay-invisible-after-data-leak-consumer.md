---
title: "Stay Invisible After a Data Leak"
description: "How Janus and email masking help reduce identity correlation when a website you use gets breached."
pubDate: "2026-03-18"
heroImage: "/images/lagoon-1.svg"
---

## The problem: data leaks don't stop at the original site

When a website gets hacked, attackers often copy a big database of user records. Over time, that leaked data can be used to:

- find the same person on other platforms
- guess which accounts belong together
- run recovery flows like password resets

Email is one of the easiest ways to connect identities across services. If your real inbox address is exposed, it can become a powerful “join key” for attackers.

## The story: connect with Janus, use email masking

Picture this:

1. You visit `example-news.com`.
2. You connect to the site using **Janus** (OIDC-based sign-in).
3. You enable **email masking** for that connection.

From the website's perspective, everything works normally. But instead of learning your real email address, the site receives a **proxied / masked email** that Janus provides for that connection (for example `userXZEZEZEZEE@proxy.janus.org` instead of `marie.dupont@gmail.com`).

## After the breach: attackers only have the masked email

Now imagine the site later experiences a data leak.

In the leaked database, attackers find the user record created by the website at sign-in time. If **email masking** was enabled, the identifier stored there is the **masked/proxied email**, not your real inbox identity.

That means:

- they cannot directly grab your actual email address from the leak
- the leaked value is much harder to reuse to trace you across other unrelated accounts

## What you can do

If you want fewer “links” between your online accounts, the practical move is simple:

1. Sign in to sites through Janus
2. Turn on email masking

You get everyday usability, and you reduce the chance that one breached website becomes a roadmap to your other accounts.
