# Branch content reference

This file contains the full instructional content for each lesson branch in the workshop repository. The `create-branches.ts` script reads this conceptual reference to understand what each branch should contain. The actual LESSON.md files are generated from this content.

Each section below corresponds to one branch and one chapter of the Mastering AI Coding Agents workshop.

---

## lessons/00-setup — Opening and Setup

### Objectives

By the end of this lesson, every participant has a working environment with all three coding agents available and has verified that the environment is functional.

### Content

#### Welcome to Patterson AI Pets

Patterson AI Pets is a team-based competitive coding game. Each team designs and maintains an autonomous coding agent represented as a pet avatar. The agent lives in a GitHub repository the team controls. Teams compete in periodic races called Shows, where every pet receives the same coding challenge and attempts to solve it autonomously. A judge agent reviews each submission against a published rubric and merges or rejects the work.

You are here to learn how AI coding agents work, how to build them, and how to make yours compete. By the end of this session you will have a working pet entered into The Show.

#### What you will leave with

- A working understanding of how AI coding agents are structured and extended
- Hands-on experience with skills, commands, sub-agents, and rules
- A pet repository entered into The Show and ready for the first race
- Three coding agents installed and configured: Claude Code, OpenCode, and GitHub Copilot CLI

#### Fork and clone the repository

1. Navigate to the workshop repository on GitHub
2. Click Fork to create your own copy
3. Clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/patterson-pets-lessons.git
```

```bash
cd patterson-pets-lessons
```

#### Bootstrap the environment

Run the bootstrap script from the repository root:

```bash
./bootstrap.sh
```

The bootstrap script checks for mise, installs all tool versions, runs `just bootstrap` to install dependencies, and verifies that every required tool is available. You should see a pass/fail report for each tool.

If any tool fails verification, raise your hand. The instructor will help troubleshoot.

#### Verify tool versions

After bootstrap completes, confirm that each core tool is available:

```bash
bun --version
```

```bash
gh --version
```

```bash
mise --version
```

```bash
just --version
```

#### Verify the three agents

Open three terminal windows or tabs. In each one, launch a different agent:

Terminal 1:

```bash
claude
```

Terminal 2:

```bash
opencode
```

Terminal 3:

```bash
gh copilot
```

Ask each agent the same question:

```text
What files are in this repository?
```

Compare the responses. Notice how each agent discovers and presents the same information differently. Some will list files, some will describe the project structure, and some will read specific files to understand context.

#### What you should have now

- A forked and cloned copy of the workshop repository
- A verified environment with bun, gh, mise, just, and all three coding agents
- Familiarity with launching each agent from the terminal

---

## lessons/01-intro — Chapter 1: Intro to AI Agents

### Objectives

Understand what AI coding agents are good at, what they are not good at, and why terminal-based agents are the focus of this workshop.

### Content

#### The problem with AI

You do not really know a tool until you know what it is not good at. AI coding agents are powerful, but they are not magic. They struggle with ambiguous requirements, novel architecture decisions, security-critical code that requires domain expertise, and problems that demand understanding of organizational context they have not been given.

Knowing when not to use AI matters as much as knowing how to use it. The workshop is as much about developing this judgment as it is about learning the mechanics.

#### The real challenge is not new

The practical bottleneck in using AI well is the same one software engineers have always faced: breaking complex problems into small, modular units of work. A well-decomposed problem is one an AI agent can solve reliably. A poorly decomposed problem produces unpredictable results regardless of how good the model is.

Here is an example of a poorly-decomposed prompt:

```text
Build me a full-stack app with auth, a dashboard, and real-time notifications.
```

The agent does not know which auth strategy you want, which dashboard layout, or which notification transport. It will guess, and its guesses will be wrong in ways that are expensive to fix.

Here is the same work, decomposed into focused prompts that an agent can execute reliably:

```text
Add a login endpoint that accepts email and password, validates against the users table, and returns a JWT with a 24-hour expiry.
```

```text
Create a dashboard page that queries the /api/metrics endpoint and renders a bar chart of daily active users for the past 30 days.
```

```text
Add a WebSocket endpoint at /ws/notifications that pushes new order events to connected clients.
```

Each prompt is small enough that the agent can solve it correctly without guessing about requirements. The human does the decomposition; the agent does the implementation.

Success or failure with AI coding agents hinges on how well the human decomposes the problem before handing it to the agent.

#### AI in the five environments

AI coding agents live in five environments:

1. **Web** — ChatGPT, Claude.ai, Gemini. Conversational, general-purpose, no direct access to your codebase.
2. **IDE** — Cursor, Windsurf, VS Code extensions. Integrated into the editor, with file context but limited autonomy.
3. **Terminal** — Claude Code, OpenCode, Copilot CLI, Aider. Full access to the shell, the filesystem, and the tool ecosystem.
4. **CI/CD** — GitHub Actions, GitLab CI. The same agent that runs locally, triggered by repository events instead of human commands.
5. **Desktop** — Computer use agents. Full GUI interaction, but slower and less reliable than terminal agents for coding tasks.

This workshop focuses on terminal agents because they offer the best combination of power, composability, and transparency.

#### Why terminals?

Terminal-based agents follow the principles that have made Unix tooling effective for decades:

- **KISS** — Keep it simple. A terminal agent does one thing: it reads a prompt, uses tools, and produces output. No GUI state to manage, no hidden context.
- **DRY** — Don't repeat yourself. Terminal agents compose with existing CLI tools rather than reimplementing them. `git`, `grep`, `curl`, and every other command-line tool is available without integration work.
- **Unix philosophy** — Do one thing well, compose with pipes.

Here is what composition looks like in practice. A terminal agent piped into standard tools:

```bash
claude --print "list all TODO comments in src/" | grep "FIXME" | sort
```

The transparency of terminal agents is a practical advantage: you can see every command the agent runs, every file it reads, and every change it makes:

```bash
claude --verbose "add input validation to the signup handler"
```

The `--verbose` flag shows every tool call the agent makes as it works, so you can see exactly what it reads and writes.

#### What comes next

The rest of the session covers:
- Chapter 2: The primitives that make agents extensible (skills, commands, sub-agents, rules)
- Chapter 3: Writing your own skill and building your pet
- Chapter 4: Watching your pet compete in the first race

#### What you should have now

- A mental model for when AI agents are and are not the right tool
- An understanding of why decomposition is the key human skill
- Awareness of the five environments and why terminals are the focus
- Familiarity with KISS, DRY, and Unix philosophy as applied to agents

---

## lessons/02-getting-started — Chapter 2: Getting Started

### Objectives

Learn the four primitives that make agents extensible, understand how AGENTS.md works, and install your first skill.

### Content

#### What an agent reads at session start

When a terminal agent starts in a repository, it reads configuration files that tell it about the project. The most important of these is `AGENTS.md` (or `CLAUDE.md` for Claude-specific projects). This file is the agent's briefing document. Everything the agent needs to know about conventions, infrastructure, and workflows that it cannot discover from the code alone belongs here.

The workshop repository's own `AGENTS.md` is the example. Open it now and read through it:

```bash
cat AGENTS.md
```

Notice that it documents pre-existing infrastructure (the Show repository, the Cloudflare endpoints, the judge skill) that no amount of code-reading would reveal.

#### Anatomy of AGENTS.md

A well-written AGENTS.md answers one question per section: what would the agent get wrong without being told this?

Here is the skeleton every project AGENTS.md should follow:

```markdown
# Project Name

One-sentence description of what this repo does and the agent's role in it.

## Stack and tooling

- **Runtime:** Bun (TypeScript). No Node.js, no npm.
- **Task runner:** just (justfile at repo root)
- **Linting:** OxLint, Biome

## Conventions

- File naming: kebab-case for all files
- Commit format: conventional commits (feat:, fix:, chore:)
- Branch naming: feat/<slug>, fix/<slug>

## Forbidden zones

- Do not modify files in migrations/ — these are append-only
- Do not edit generated files in dist/

## Pre-existing infrastructure

- Production API at https://api.example.com
- Staging deploys to staging.example.com on every push to main

## How to work

- Run tests: just test
- Lint: just lint
- Deploy: just deploy (requires DEPLOY_TOKEN env var)
```

Each section passes the test: would the agent get this wrong without being told? Generic advice the agent already knows ("write clear code") fails the test and should be removed. Every line in AGENTS.md occupies context for the entire session. Treat it as the most expensive comment in the codebase.

#### The four primitives

Agents are extended through four primitives:

**Skills** are self-contained instruction sets the agent consults when relevant. A skill lives in a directory with a `SKILL.md` entry file and optional subdirectories:

```text
my-skill/
├── SKILL.md              # Entry point: frontmatter + instructions
├── scripts/              # Executable code
│   └── validate.ts
├── references/           # Docs loaded on demand
│   └── api-spec.md
└── assets/               # Templates and resources
    └── output.md.template
```

Skills trigger based on their description field: when the user's request matches what the skill describes, the agent loads and follows its instructions.

The `SKILL.md` frontmatter looks like this:

```yaml
---
name: my-skill
description: >
  Deploy the application to production. Use this skill when the user
  asks to deploy, ship, push to prod, or release a new version.
metadata:
  author: Your Name
  version: 1.0.0
---
```

**Commands** are user-invoked shortcuts. In Claude Code, a file at `.claude/commands/deploy.md` creates a `/deploy` command the user can type. Commands and skills have been merged in Claude Code: a skill at `.claude/skills/deploy/SKILL.md` also creates a `/deploy` invocation. The distinction matters in other agents.

**Sub-agents** are specialized workers the agent dispatches for focused tasks. The parent agent coordinates; the sub-agent executes. Sub-agents are useful for parallelizing independent work or for isolating a task that requires a different set of tools.

**Rules** are constraints the agent must follow. Rules live in `.claude/rules/*.md` and can be scoped to specific file patterns. Here is an example rule:

```markdown
---
paths:
  - "migrations/**"
---

# No migration edits

Never modify existing migration files. Migrations are append-only.
To change the schema, create a new migration file.
```

Rules are always in context, so they should be short and specific.

#### MCP servers

MCP (Model Context Protocol) servers extend the agent's available tools. An MCP server is a process that exposes tools, resources, and prompts over a standard protocol. When an agent connects to an MCP server, the server's tools appear alongside the agent's built-in tools.

The configuration lives in `.mcp.json` at the repository root:

```json
{
  "mcpServers": {
    "cloudflare-docs": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-cloudflare-docs"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-context7"]
    }
  }
}
```

The workshop does not go deeper into MCP server development, but knowing that the mechanism exists is important because several of the pre-provisioned services (Cloudflare Docs, Context7) are available as MCP servers.

#### Hands-on: Install a skill

Install a skill from the community directory:

```bash
npx skills add code-review
```

Confirm the company-wide judge skill is present in the workshop environment. The judge was installed at the organization scope, so it appears automatically without per-team configuration. Verify it by listing installed skills:

```bash
claude /skills
```

Trigger the installed skill to confirm it activates. Ask your agent a question that falls within the skill's description, and verify that the agent consults the skill in its response.

#### What you should have now

- An understanding of how AGENTS.md works and what belongs in it
- Knowledge of the four primitives: skills, commands, sub-agents, rules
- Awareness of MCP servers and how they extend agent capabilities
- A skill installed and verified in your environment

---

## lessons/03-going-deeper — Chapter 3: Going Deeper

### Objectives

Write your own skill by building a pet, understand the hierarchical skill structure, and submit your pet to The Show.

### Content

#### Pet authorship is skill authorship

A pet in Patterson AI Pets is itself a skill. The pet's `SKILL.md` is what the judge reads when evaluating a submission. This means that learning to build a good pet is identical to learning to build a good skill. Every skill-authoring technique you learn here transfers directly to building workflow skills, review skills, and automation skills for your day-to-day work.

#### Scaffold a new pet

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

#### Write the SKILL.md

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

#### Write a verification script

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

#### The hierarchical skill structure

Skills operate at three levels:

1. **Company-wide** — Installed at the organization scope. Every agent in every team picks these up automatically. The judge is a company-wide skill.
2. **Personal** — Installed for a specific user. Personal preferences, workflow shortcuts, and cross-project tools.
3. **Project** — Lives in the repository. The pet itself is a project-level skill.

The hierarchy means that the judge (company-wide) automatically governs every pet (project-level) without per-team configuration. When a pet opens a pull request, the judge skill activates because it matches the review context, evaluates the submission against the rubric, and merges or rejects.

#### Push, test, and submit

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

#### Guardrails

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

#### What you should have now

- A pet repository with a well-authored SKILL.md
- An understanding of the three-level skill hierarchy
- A submission registered with The Show via pull request
- Awareness of guardrails and why they matter for autonomous agents

---

## lessons/04-tying-it-together — Chapter 4: Tying It All Together

### Objectives

See the full lifecycle in action: the agent you built locally runs in CI, the judge evaluates submissions, and the leaderboard updates in real time.

### Content

#### The same agent, different trigger

The agent you used locally during the workshop is the same agent that runs in CI when your pet's pull request lands in the Show repository. The code is identical. The skill is identical. The only difference is the trigger: locally, you typed a command; in CI, a GitHub Actions workflow fires when a pull request event occurs.

Here is what a pet's CI workflow looks like:

```yaml
name: Pet Race

on:
  repository_dispatch:
    types: [new-challenge]

permissions:
  contents: write
  pull-requests: write

jobs:
  race:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: bun install

      - name: Run pet agent
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude --print "Read the challenge in CHALLENGE.md and solve it following the instructions in SKILL.md. Commit your solution and open a pull request."

      - name: Submit to The Show
        run: |
          gh pr create --title "Race submission: ${{ github.repository }}" --body "Automated submission from pet CI"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This is the point of the terminal-agent model. There is no separate "CI version" of the agent. The same instructions, the same tools, the same constraints. If it works on your machine, it works in CI. If it fails in CI, you can reproduce it on your machine.

#### The judge agent

The judge is a company-wide skill installed at the Patterson organization scope. When a pet opens a pull request against the Show repository, the judge activates because the pull request context matches the judge's description.

The judge:

1. Reads the pet's SKILL.md from the pull request branch
2. Reads the challenge specification from the Show repository
3. Evaluates the pet's solution against the published rubric
4. Leaves review comments explaining the evaluation
5. Assigns a score based on correctness, simplicity, clarity, and engineering hygiene
6. Factors in token efficiency: smaller, more focused agents score higher
7. Merges or rejects the pull request based on the combined score

Here is what a judge review comment looks like on a pull request:

```text
## Judge Review: thunderpaw

### Scores

| Criterion          | Score | Max | Notes                              |
|--------------------|-------|-----|------------------------------------|
| Correctness        | 25    | 30  | All tests pass, one edge case missed |
| Simplicity         | 18    | 20  | Clean solution, no over-engineering  |
| Clarity            | 15    | 15  | Well-named functions, clear flow     |
| Engineering hygiene | 12   | 15  | Missing error handling at API boundary |
| Token efficiency   | 16    | 20  | 12k tokens used (budget: 10k)       |

### Total: 86 / 100

**Decision: MERGE**

The submission meets the threshold. Correctness is strong. The token budget
was slightly exceeded — consider tightening the SKILL.md instructions to
reduce unnecessary exploration.
```

The scoring creates a real tradeoff between capability and economy. A pet that solves the challenge perfectly but burns excessive tokens scores lower than a focused pet that solves it cleanly. This mirrors the actual constraints of using AI agents in production.

#### Race day

All registered pets receive the workshop's first challenge simultaneously. The sequence:

1. The challenge is posted to the Show repository
2. Each pet's CI workflow detects the new challenge and triggers the pet agent
3. Each pet reads the challenge, consults its SKILL.md, and produces a pull request
4. The judge reviews each submission as it arrives
5. The leaderboard updates as scores are finalized

You watch but do not intervene. The hands-off character is deliberate: it mirrors production use of autonomous agents, where preparation is the work and the run is the evaluation.

Check the leaderboard status during the race:

```bash
gh api repos/danielbodnar/the-show/contents/LEADERBOARD.md --jq '.content' | base64 -d
```

Or view it directly in the browser:

```bash
gh browse danielbodnar/the-show -- blob/main/LEADERBOARD.md
```

If time permits, review another team's pet repository to see how a different approach scored. Cross-team learning is one of the game's design goals.

#### Beyond the race: CI/CD patterns

The same primitive that powers the race supports other CI/CD workflows:

**Issue triage** — a skill that categorizes new issues:

```yaml
name: Triage Issues

on:
  issues:
    types: [opened]

jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          claude --print "Read issue #${{ github.event.issue.number }}. Assign a priority label (p0-critical, p1-high, p2-medium, p3-low) and a category label based on the content."
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Each of these patterns is a skill. Each can be installed at the company, personal, or project level. Each runs the same in CI as it does locally.

#### What to take home

- The workshop repository, including this lesson structure and all supporting materials
- Your pet, entered in The Show and ready for the next race
- The pet template, which you can use to scaffold new pets or new skills for any purpose
- The rules document, which defines how The Show operates and how scoring works
- Access to the three coding agents, configured and ready for daily use

#### The season ahead

Patterson AI Pets continues after the workshop. Races happen on a regular cadence. Between races, iterate on your pet: refine the SKILL.md, add supporting references, improve the strategy. Non-technical contributions (pet design, race commentary, analysis writeups) earn additional points for your team.

The team with the highest cumulative score at season end is named Best in Show.

#### What you should have now

- A live demonstration of the full agent lifecycle: local development to CI execution
- Understanding of how the judge evaluates submissions
- Awareness of CI/CD patterns beyond racing
- Everything you need to continue participating in The Show after the workshop
