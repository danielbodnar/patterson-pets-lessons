# Lesson 03: Going Deeper

## Objectives

Write your own skill by building a pet, understand the hierarchical skill structure, and submit your pet to The Show.

## Pet authorship is skill authorship

A pet in Patterson AI Pets is itself a skill. The pet's `SKILL.md` is what the judge reads when evaluating a submission. This means that learning to build a good pet is identical to learning to build a good skill. Every skill-authoring technique you learn here transfers directly to building workflow skills, review skills, and automation skills for your day-to-day work.

## Scaffold a new pet

Use the Patterson skill-creator template to scaffold your pet:

```bash
bunx patterson-skill-creator init my-pet-name
```

This creates a directory with the standard structure:

```text
my-pet-name/
├── SKILL.md              # The pet: name, description, instructions
├── AGENTS.md             # Conventions for working on this pet
├── README.md             # Human-facing introduction
├── references/           # Strategy docs loaded on demand
│   └── approach.md
├── assets/               # Lore, backstory, visual identity
│   └── lore.md
└── scripts/              # Verification and utility scripts
    └── verify.ts
```

## Write the SKILL.md

The SKILL.md frontmatter must include `name` and `description`. Here is a complete example for a pet:

```yaml
---
name: thunderpaw
description: >
  Thunderpaw is a competitive coding pet that solves challenges with a
  test-driven, minimal approach. Use Thunderpaw when evaluating coding
  challenge submissions, reviewing pull requests for the Patterson AI Pets
  Show, or when the user mentions Thunderpaw by name. Thunderpaw prioritizes
  correctness over cleverness and writes the simplest solution that passes
  all tests.
metadata:
  author: Team Lightning
  version: 1.0.0
  breed: Border Collie
  team: Lightning Bolts
---

# Thunderpaw

## Strategy

Thunderpaw approaches every challenge with three steps:

1. Read the challenge specification completely before writing any code
2. Write failing tests that cover the requirements and edge cases
3. Implement the simplest solution that makes all tests pass

## Engineering standards

- Every function has a test
- No dead code, no commented-out code
- Error handling at system boundaries only
- Conventional commits on every change

## What Thunderpaw refuses to do

- Over-engineer: no abstractions beyond what the challenge requires
- Skip tests: red-green-refactor is non-negotiable
- Ignore the rubric: every decision maps to a scoring criterion
```

The body contains the pet's instructions for solving challenges. Focus on the pet's strategy: what kinds of problems it approaches, how it decomposes work, what engineering standards it enforces, and what it refuses to do. A focused, well-described pet outperforms a verbose one because the judge reads the SKILL.md under a context budget.

## Write a verification script

Add a verification script at `scripts/verify.ts` that checks the pet's structure:

```typescript
#!/usr/bin/env bun

import { existsSync } from "node:fs";

const required = ["SKILL.md", "AGENTS.md", "README.md"];
const optional = ["references/approach.md", "assets/lore.md", "scripts/verify.ts"];

let passed = 0;
let failed = 0;

for (const file of required) {
  if (existsSync(file)) {
    console.log(`[pass] ${file}`);
    passed++;
  } else {
    console.error(`[fail] ${file} is missing (required)`);
    failed++;
  }
}

for (const file of optional) {
  if (existsSync(file)) {
    console.log(`[pass] ${file}`);
    passed++;
  } else {
    console.log(`[skip] ${file} (optional)`);
  }
}

const skillContent = await Bun.file("SKILL.md").text();
if (!skillContent.startsWith("---")) {
  console.error("[fail] SKILL.md is missing YAML frontmatter");
  failed++;
} else {
  console.log("[pass] SKILL.md has frontmatter");
  passed++;
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
```

Run it to check your pet:

```bash
bun run scripts/verify.ts
```

## The hierarchical skill structure

Skills operate at three levels:

1. **Company-wide** — Installed at the organization scope. Every agent in every team picks these up automatically. The judge is a company-wide skill.
2. **Personal** — Installed for a specific user. Personal preferences, workflow shortcuts, and cross-project tools.
3. **Project** — Lives in the repository. The pet itself is a project-level skill.

The hierarchy means that the judge (company-wide) automatically governs every pet (project-level) without per-team configuration. When a pet opens a pull request, the judge skill activates because it matches the review context, evaluates the submission against the rubric, and merges or rejects.

## Push, test, and submit

Push your pet repository to GitHub:

```bash
git add -A
```

```bash
git commit -m "feat: initial pet scaffold"
```

```bash
git push origin main
```

Test it locally against the practice challenge:

```bash
just race
```

Watch the output. The agent reads the challenge, consults your SKILL.md, produces a solution, and reports the result. If the solution fails, iterate on the SKILL.md instructions and try again.

When you are satisfied, submit to The Show:

```bash
just submit
```

This opens a pull request against the Show repository. The judge will review it during the race in Chapter 4.

## Guardrails

Once a pet runs autonomously in CI, guardrails are not optional. Three mechanisms:

**Allow lists** explicitly enumerate what the pet may do. Configure them in `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Bash(bun test)",
      "Bash(bun run lint)",
      "Bash(git add *)",
      "Bash(git commit *)"
    ]
  }
}
```

**Deny lists** explicitly block dangerous operations:

```json
{
  "permissions": {
    "deny": [
      "Bash(git push --force *)",
      "Bash(rm -rf *)",
      "Bash(curl *)"
    ]
  }
}
```

**Pre-tool-use hooks** run code before the agent executes a tool call. The hook can inspect the call and reject it before damage is done. Configure hooks in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/check-command.sh"
          }
        ]
      }
    ]
  }
}
```

The judge enforces a baseline set of guardrails on every submission. Teams can add stricter guardrails to their own pets.

## What you should have now

- A pet repository with a well-authored SKILL.md
- An understanding of the three-level skill hierarchy
- A submission registered with The Show via pull request
- Awareness of guardrails and why they matter for autonomous agents
