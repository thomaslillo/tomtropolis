---
title: 'Muse Is What Agentic AI Looks Like for Everyone'
subtitle: 'Meta is putting the ClawBot-like experience in the hands of normal people'
date: 2026-10-07
author: 'Thomas Lillo'
tags: ["ai", "agents", "meta", "learning in public"]
layout: ../../layouts/BlogLayout.astro
---

I have been using Meta's new agent, Muse, as a assistant since it launched. It's been investigating skills I need for work, looking up possible vacation plans and creating presentation for me, helping research winter tires, and find interesting restaurants and events nearby.

None of the above are fully handled by Muse, but it is able to do a lot of the initial grunt work and leave me with just the fun parts and final decisions making.

I have a dedicated Google account setup for the agent so it can create and edit docs, event reminders, etc, without risking anything by giving it access to my personal accounts. I've found this separation to be very useful and it has helped me do a lot more with less concern.

## How Muse Works

The technical details in [David Singleton's post](https://x.com/dps/status/2103161493722419334?s=20) explain why Muse feels different from a chatbot. Each user gets a cloud computer with a Linux filesystem, workspace, and memory. Muse is not just an LLM visiting a disposable sandbox; it is an agent running inside an inspectable environment.

Meta's design keeps authority outside that environment. Host services control credentials, connectors, permissions, and network access, with Sentinel acting as the authority for sensitive actions. Credentials can be scoped rather than exposing raw passwords, and important actions can pause for approval. Meta also describes defenses against prompt injection and controls on data leaving the virtual machine.

The model is natively multimodal and offers **Instant**, **Thinking**, and **Contemplating** modes, including parallel reasoning.

I've not found any issues with the capabilities of these models so far, but I could see them degrading the output quality or put the advanced models behind a paywall after it gains some initial traction.

## Why Muse Matters

Power users have connected chat interfaces to APIs, browsers, and scripts for years. Muse makes that capability accessible to normal people through products they already use. That is why I think Meta is breaking new ground. It's bringing a ClawBot-like experience to normies.

We have already seen a few instances of where Muse has made mistakes on behalf of its user. Like accepting low-ball offers for their FB marketplace ads and arranging pickups without notifying the user. But as people learn how to use these tools and they Meta is able to fix these initial concern I think their value will become very obvious to people.

Websites will have to change as a result. Applying for jobs, signing up for courses, buying tickets, booking travel, and making appointments can become tasks we delegate, with humans still approving consequential decisions. Sites will need clear data, stable actions, and permissions that work for both people and agents.

I work in digital analytics currently, so I am especially interested in what this means for the marketing world. If agents increasingly discover products, compare options, and complete purchases, the old channel assumptions will change. How people find brands, click, convert, and attribute a sale may all look different.

Marketers are already exploring and building a new wave of tools for these new channels. For these people, Muse is worth watching. It may be one of the tools that turns agentic interaction from a power-user trick into an everyday part of how people use the internet.