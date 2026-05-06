# Story Bank — Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

## How it works

1. Every time `/career-ops oferta` generates Block F (Interview Plan), new STAR+R stories get appended here
2. Before your next interview, review this file — your stories are already organized by theme
3. The "Big Three" questions can be answered with stories from this bank:
   - "Tell me about yourself" → combine 2-3 stories into a narrative
   - "Tell me about your most impactful project" → pick your highest-impact story
   - "Tell me about a conflict you resolved" → find a story with a Reflection

## Stories

<!-- Stories will be added here as you evaluate offers -->
<!-- Format:
### [Theme] Story Title
**Source:** Report #NNN — Company — Role
**S (Situation):** ...
**T (Task):** ...
**A (Action):** ...
**R (Result):** ...
**Reflection:** What I learned / what I'd do differently
**Best for questions about:** [list of question types this story answers]
-->

### [Design Systems] Perceptyx Design System — 80%+ Adoption
**Source:** Report #001 — Caylent — Senior Frontend Developer
**S:** UI was inconsistent across 6 product teams at Perceptyx. No shared components, no design tokens, every team reinventing the same patterns.
**T:** Lead the creation of a company-wide Design System that teams would actually use.
**A:** Built 40+ components using Vue.js + TypeScript with design tokens as the source of truth. Embedded into team workflows by working directly with each team lead during rollout. Set up Figma-to-code alignment to reduce handoff drift.
**R:** 80%+ component adoption across all product teams. Became the de facto standard for new features.
**Reflection:** Adoption is harder than building. The system succeeded because I treated it as a product — with onboarding, docs, and champions in each team — not just as a library.
**Best for questions about:** "Tell me about a project with company-wide impact", "How do you influence teams you don't manage?", "Design systems", "Cross-team collaboration"

---

### [Accessibility] A11y Initiative — 30% Faster Review Cycles
**Source:** Report #001 — Caylent — Senior Frontend Developer
**S:** Accessibility issues at Perceptyx were caught late in QA — post-design, post-development, costing rework cycles.
**T:** Shift accessibility left so it was caught at the component level, not in QA.
**A:** Built WCAG-compliant component variants with a11y baked in. Added a11y linting to CI pipeline. Ran internal workshops to change team mindset from "a11y as QA" to "a11y as architecture."
**R:** Cut accessibility review cycles by 30%.
**Reflection:** Accessibility problems are almost always architectural. Retrofitting is 10x more expensive than designing it in. The real win was changing when the conversation happened, not just the tooling.
**Best for questions about:** "Accessibility", "Shifting left", "Engineering culture change", "How do you improve quality?"

---

### [Cross-timezone Collaboration] Accenture LATAM/US Bridge — Kimberly-Clark & Dyson
**Source:** Report #001 — Caylent — Senior Frontend Developer
**S:** At Accenture, the US team owned specs and stakeholder relationships; the Argentina team owned implementation. Communication gaps caused rework and misaligned deliveries.
**T:** Serve as the Argentina-side technical liaison — bridge requirements to implementation without losing context.
**A:** Ran structured weekly syncs between both teams. Translated business requirements into actionable dev tickets. Became the go-to escalation point for ambiguous specs.
**R:** On-time delivery. Promoted to Argentina referent for JavaScript/CSS standards.
**Reflection:** Ambiguity at kickoff is expensive. A longer kickoff meeting costs less than a mid-sprint course correction. I now front-load clarity deliberately.
**Best for questions about:** "Remote/distributed teams", "Client communication", "Cross-timezone work", "Stakeholder management"

---

### [Standards & Mentorship] Frontend Guild — Aligning Distributed Teams
**Source:** Report #001 — Caylent — Senior Frontend Developer
**S:** Perceptyx had frontend teams working independently across distributed locations with no shared engineering standards, leading to inconsistencies in code reviews and duplicated effort.
**T:** Create alignment across teams without formal authority.
**A:** Founded and ran the Frontend Guild — bi-weekly meetings, published RFC templates for architecture decisions, pair-programmed with juniors on ambiguous problems.
**R:** Reduced cross-team code review conflicts. RFC templates adopted as standard practice for frontend decisions.
**Reflection:** Standards only scale if they're low-friction to follow. Every standard I wrote had a "why" attached — if I couldn't explain the reason, I reconsidered the standard.
**Best for questions about:** "Mentoring", "Influence without authority", "Engineering culture", "Leadership"
