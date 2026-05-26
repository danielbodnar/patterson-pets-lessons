---
name: workshop-repo-scaffold
description: Generate the Patterson AI Pets workshop repository with a branch-per-lesson structure that lets attendees drop in or out mid-session without losing their place. Use this skill whenever the user mentions setting up the workshop repo, scaffolding the lessons, creating the branch-per-lesson structure, initializing the Patterson AI Pets workshop, building workshop branches, or preparing the lesson repository. Also trigger when the user references the workshop repository in any planning or preparation context, asks about the branch model, or wants to update or regenerate the lesson structure. This is a foundational setup task for the workshop and should trigger aggressively on any mention of workshop repository preparation.
metadata:
  author: Daniel Bodnar
  version: 1.0.0
  audience: Patterson TechDays
---

# Workshop Repository Scaffold

This skill produces a Git repository where each lesson of the Mastering AI Coding Agents workshop is a separate branch. Each branch contains the completed state of the workshop up to and including that lesson. A participant who arrives during Chapter 3 checks out `lessons/03-going-deeper` and picks up from there, with all prior work already in place.

## What the skill produces

The output is a repository with a `main` branch containing the shared infrastructure (README, AGENTS.md, bootstrap script, dev environment files) and five lesson branches chained linearly:

```
main
 └── lessons/00-setup
      └── lessons/01-intro
           └── lessons/02-getting-started
                └── lessons/03-going-deeper
                     └── lessons/04-tying-it-together
```

Each branch inherits everything from its parent. Checking out any branch gives the participant a complete, working state through that point in the workshop.

## Branch contents

Each lesson branch adds a `lessons/NN-slug/LESSON.md` file containing the full instructional content for that chapter, derived from the workshop plan. The content is generated, not placeholder. It includes objectives, key concepts, hands-on exercises, and what the participant should have at the end of the chapter.

| Branch | Chapter | Content |
|---|---|---|
| `lessons/00-setup` | Opening | Fork, bootstrap, environment verification, three agents side by side |
| `lessons/01-intro` | Ch 1: Intro to AI Agents | The problem with AI, decomposition, five environments, why terminals |
| `lessons/02-getting-started` | Ch 2: Getting Started | AGENTS.md anatomy, four primitives, MCP servers, install a skill |
| `lessons/03-going-deeper` | Ch 3: Going Deeper | Pet as skill, scaffolding, skill hierarchy, push/test/submit, guardrails |
| `lessons/04-tying-it-together` | Ch 4: Tying It All Together | Local = CI, judge demo, race day, CI/CD patterns, takeaways |

## How to run the scaffold

The skill has two entry points depending on context:

**Creating a new workshop repo from scratch:**
Run `scripts/scaffold.ts` with Bun. It creates the target directory, initializes the git repo, copies all templates from `assets/`, commits the base state on `main`, and then invokes `create-branches.ts` to lay down the lesson branches.

```bash
bun run scripts/scaffold.ts --target ./patterson-ai-pets-workshop
```

**Regenerating branches on an existing repo:**
Run `assets/create-branches.ts` directly. It is idempotent: branches that already exist are skipped, and the working tree must be clean.

```bash
bun run scripts/create-branches.ts
```

The branch creator checks `git rev-parse --verify --quiet refs/heads/lessons/NN-slug` for each branch before attempting creation. It never force-pushes and never deletes branches. Re-running on a fully scaffolded repo is a no-op.

## Composition with other skills

**Dev environment (prompt 06):** The bootstrap script in `assets/bootstrap.sh.template` assumes that `mise.toml`, `justfile`, `devcontainer.json`, and `Dockerfile` are already present in the repository. These are produced by the `patterson-dev-environment` skill. The bootstrap script does not reimplement the dev environment; it invokes it.

**AGENTS.md (prompt 04):** The AGENTS.md in `assets/AGENTS.md.template` is pre-authored following the conventions from prompt 04. It documents pre-existing infrastructure (Show repo, Cloudflare DOs, judge skill, leaderboard) that agents cannot discover from the repository tree alone.

## Files in this skill

| File | When to read |
|---|---|
| `scripts/scaffold.ts` | When creating a new workshop repo from scratch |
| `assets/create-branches.ts` | When regenerating branches or understanding the branch creation logic |
| `assets/README.md.template` | When reviewing or updating the attendee-facing branch documentation |
| `assets/HANDOFF.md.template` | When reviewing or updating the maintainer handoff document |
| `assets/AGENTS.md.template` | When reviewing or updating the workshop repo's agent instructions |
| `assets/bootstrap.sh.template` | When reviewing or updating the participant bootstrap experience |
| `references/branch-content.md` | When reviewing or updating the lesson content for any branch |
