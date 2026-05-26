# Lesson 02: Getting Started

## Objectives

Learn the four primitives that make agents extensible, understand how AGENTS.md works, and install your first skill.

## What an agent reads at session start

When a terminal agent starts in a repository, it reads configuration files that tell it about the project. The most important of these is `AGENTS.md` (or `CLAUDE.md` for Claude-specific projects). This file is the agent's briefing document. Everything the agent needs to know about conventions, infrastructure, and workflows that it cannot discover from the code alone belongs here.

The workshop repository's own `AGENTS.md` is the example. Open it now and read through it:

```bash
cat AGENTS.md
```

Notice that it documents pre-existing infrastructure (the Show repository, the Cloudflare endpoints, the judge skill) that no amount of code-reading would reveal.

## Anatomy of AGENTS.md

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

## The four primitives

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

## MCP servers

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

## Hands-on: Install a skill

Install a skill from the community directory:

```bash
npx skills add code-review
```

Confirm the company-wide judge skill is present in the workshop environment. The judge was installed at the organization scope, so it appears automatically without per-team configuration. Verify it by listing installed skills:

```bash
claude /skills
```

Trigger the installed skill to confirm it activates. Ask your agent a question that falls within the skill's description, and verify that the agent consults the skill in its response.

## What you should have now

- An understanding of how AGENTS.md works and what belongs in it
- Knowledge of the four primitives: skills, commands, sub-agents, rules
- Awareness of MCP servers and how they extend agent capabilities
- A skill installed and verified in your environment
