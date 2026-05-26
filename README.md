# Patterson AI Pets Workshop

Welcome to Mastering AI Coding Agents. This repository contains the workshop materials organized as a branch-per-lesson structure. Each branch represents the completed state of the workshop through that chapter.

## Quick start

```bash
git clone <your-fork-url>
cd patterson-pets-lessons
./bootstrap.sh
```

The bootstrap script installs all tools, verifies the environment, and reports pass/fail for each component.

## The branch model

This repository uses a linear branch structure where each lesson branch builds on the previous one:

```
main                              Base repo: infrastructure, configs, scripts
 └── lessons/00-setup             Opening: fork, bootstrap, verify environment
      └── lessons/01-intro        Ch 1: what AI agents are and are not good at
           └── lessons/02-getting-started   Ch 2: the four primitives, AGENTS.md, install a skill
                └── lessons/03-going-deeper        Ch 3: build your pet, submit to The Show
                     └── lessons/04-tying-it-together   Ch 4: race day, the judge, CI/CD patterns
```

Each branch contains everything from all previous branches plus the content for its own chapter. Checking out `lessons/02-getting-started` gives you the completed state through Chapter 2, including everything from the Setup and Chapter 1.

## How to switch branches

If you fall behind or arrive late, switch to the branch for the current chapter:

```bash
git stash           # save any uncommitted work
git checkout lessons/02-getting-started   # replace with current chapter
```

What happens when you switch:

- Your working directory updates to the completed state through that chapter
- Any uncommitted changes are saved in the stash (retrieve with `git stash pop` later)
- You can continue working from the new branch as if you had completed all prior lessons
- The environment and dependencies are the same across all branches

If you have uncommitted work you want to discard instead of stashing:

```bash
git checkout -- .
git checkout lessons/02-getting-started
```

## Branch reference

| Branch | Chapter | What it adds |
|---|---|---|
| `main` | — | Base infrastructure, configs, bootstrap, scripts |
| `lessons/00-setup` | Opening | Fork instructions, environment verification, three-agent comparison |
| `lessons/01-intro` | Ch 1 | Conceptual ground: when to use AI, decomposition, five environments |
| `lessons/02-getting-started` | Ch 2 | AGENTS.md anatomy, four primitives, MCP servers, skill installation |
| `lessons/03-going-deeper` | Ch 3 | Pet authorship, skill hierarchy, push/test/submit, guardrails |
| `lessons/04-tying-it-together` | Ch 4 | Judge demo, race day, CI/CD patterns, takeaways |

## Available tools

After running the bootstrap script, you have:

- **bun** — TypeScript runtime and package manager
- **gh** — GitHub CLI for repository and PR operations
- **mise** — Tool version manager
- **just** — Task runner (type `just` to see available commands)
- **claude** — Claude Code (terminal AI agent)
- **opencode** — OpenCode (terminal AI agent)
- **gh copilot** — GitHub Copilot CLI (terminal AI agent)

## Common tasks

```bash
just bootstrap    # Install dependencies and verify environment
just test         # Run the pet's test suite
just lint         # Lint and format
just race         # Run the practice challenge locally
just submit       # Push pet and open PR to The Show
```

## Resources

- [Patterson AI Pets rules](https://github.com/danielbodnar/the-show)
- [agentskills.io specification](https://agentskills.io/specification)
- [Claude Code documentation](https://code.claude.com/docs)
- [skills.sh community directory](https://skills.sh)
