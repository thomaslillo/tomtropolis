---
title: 'Conways Law Justifies Me Being in Other Peoples Business'
subtitle: 'Its a superpower to be a bit of a nosy person at work'
date: 2024-04-20
author: 'Thomas Lillo'
tags: ["astro", "blogging", "learning in public", "data"]
layout: ../../layouts/BlogLayout.astro
---

# Conway's Law Justifies Me Being in Other People's Business

On every team I've ever worked on I've been able to get things done faster than the average team member. Not due to any advantage in skills or brainpower, I'm usually disadvantaged in these domains, because I just ask people questions outside of my normal "information space" as I interact with the different systems (organizational and technical) in my day to day work.

Frequently I've found issues I've had at work we're caused by either lacking context or a black-box external dependency. If you've every encountered something illogical in a piece of software, maybe two things that should connect but don't, there is a chance it's because the people that built those parts didn't talk enough.

---

From his paper [How Do Committees Invent?](https://www.melconway.com/Home/pdf/committees.pdf), Conway states that "organizations which design systems (in the broad sense used here) are constrained to produce designs which are copies of the communication structures of these organizations".

In other words, your software architecture will inevitably mirror your org chart, whether you want it to or not. If your frontend and backend teams barely talk, you'll end up with janky APIs and brittle integrations. If your security team operates in a silo, you'll get security bolted on as an afterthought, rather than baked into the foundation of your code. The boundaries in your code reflect the boundaries in your communication patterns. Those two systems that should obviously share data but require painful manual syncing? Different teams, different priorities, minimal communication.

---

As a nosy person, some might say curious, I frequently am able to fix things or solve issues by being an information bridge. When you understand Conway's Law, being nosy becomes a legitimate engineering strategy. Every conversation you have with someone outside your immediate team is essentially reconnaissance for better system design. You're not just being social, you're mapping the hidden dependencies and communication gaps that will eventually manifest as technical debt.

Every conversation compounds, that chat with someone from DevOps about their deployment pipeline might not seem relevant to your frontend work, until suddenly you're debugging why your feature flags aren't updating and you remember they mentioned something about caching layers.

When you understand how the sausage is made across different parts of the organization, you start seeing the invisible threads that connect everything. You become the person who can say "oh, that's probably because of X" when everyone else is scratching their heads. Not because you're smarter, but because you've accidentally mapped the actual system architecture—the one that includes humans.

This is why being in other people's business isn't just nosiness, it's systems thinking. Every question you ask, every conversation you have, every bit of context you gather is helping you understand the real architecture of your organization. And once you understand that, you can work with it instead of against it.

Your curiosity isn't a distraction from your work, it's the key to understanding why the work is hard in the first place. Conway's Law means that better communication leads to better software. And better software starts with understanding the humans who build it.

## How To Be An Information Bridge:

**Warm handoffs:** as a practice give you lots of good information without the need to figure out who to talk to. Instead of just getting a ticket thrown over the wall, actually talk to the person who filed it. You'll learn about their workflow, their pain points, and often discover that what they're asking for isn't actually what they need. I got this from [Will Larson](https://lethain.com/no-wrong-doors).

**Being in an office (when possible) and participating in activities:** A great way to ask people about what they do. Remote work is great, but there's something irreplaceable about overhearing a conversation between two people from different teams and realizing they're solving the same problem in completely different ways. We spend so much of our time at work and people love to share things about themselves once they're comfortable so if you're actually interested usually people can tell and will freely share all of their knowledge.

**If remote, making time to speak with everyone (across all areas of the business) one-on-one:** Most people are genuinely excited to talk about their work when someone shows authentic interest. That enthusiasm is your gateway to understanding the real system architecture not just the one in the documentation. It doesn't need to be an interrogation, and you don't need to actually understand everything they're saying, but every time you learn something it makes the next time you hear it a little more comprehensible.

**Understand how other people's systems work (aim for high-level understanding):** If you know what the small issues and quirks of the systems you interact with are you can better plan and recognize when something you're doing should actually be part of a different system, or know when you might be doing something that will cause others pain (like changing an API endpoint to follow "best practises").
