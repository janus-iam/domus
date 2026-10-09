---
title: "Janus Realms"
description: "A quick overview of Janus realms"
pubDate: "Mar 18 2026"
heroImage: "/images/lagoon-3.svg"
---

Janus is built on Keycloak and ships with three realms. We name them after figures from the Roman stories around Janus—**canens**, **proca**, and **carna**—so the split between environments reads like one family tree: separate homes, same lineage.

Each realm is a strictly isolated space: a user exists in **one realm only**, with no identity shared across realms.

## Realm `prod` — **canens**

Named for **Canens**, the daughter in Janus’s household—production is where live users and services live.

## Realm `dev` — **proca**

Named for **Proca**, the son’s line in that story—development and experimentation happen here, away from production.

## Realm `ops` — **carna**

Named for **Carna**, the maternal figure in the family—this realm holds only operations accounts used to run and maintain Janus itself (maintenance, monitoring, and day-to-day exploitation of the platform).
