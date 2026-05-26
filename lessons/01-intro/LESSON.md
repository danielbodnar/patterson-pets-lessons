# Lesson 01: Intro to AI Agents

## Objectives

Understand what AI coding agents are good at, what they are not good at, and why terminal-based agents are the focus of this workshop.

## The problem with AI

You do not really know a tool until you know what it is not good at. AI coding agents are powerful, but they are not magic. They struggle with ambiguous requirements, novel architecture decisions, security-critical code that requires domain expertise, and problems that demand understanding of organizational context they have not been given.

Knowing when not to use AI matters as much as knowing how to use it. The workshop is as much about developing this judgment as it is about learning the mechanics.

## The real challenge is not new

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

Success or failure with AI coding agents hinges on how well the human decomposes the problem before handing it to the agent. This is the skill that separates effective AI users from ineffective ones, and it is the same skill that separates effective engineers from ineffective ones.

## AI in the five environments

AI coding agents live in five environments:

1. **Web** — ChatGPT, Claude.ai, Gemini. Conversational, general-purpose, no direct access to your codebase.
2. **IDE** — Cursor, Windsurf, VS Code extensions. Integrated into the editor, with file context but limited autonomy.
3. **Terminal** — Claude Code, OpenCode, Copilot CLI, Aider. Full access to the shell, the filesystem, and the tool ecosystem.
4. **CI/CD** — GitHub Actions, GitLab CI. The same agent that runs locally, triggered by repository events instead of human commands.
5. **Desktop** — Computer use agents. Full GUI interaction, but slower and less reliable than terminal agents for coding tasks.

This workshop focuses on terminal agents because they offer the best combination of power, composability, and transparency.

## Why terminals?

Terminal-based agents follow the principles that have made Unix tooling effective for decades:

- **KISS** — Keep it simple. A terminal agent does one thing: it reads a prompt, uses tools, and produces output. No GUI state to manage, no hidden context.
- **DRY** — Don't repeat yourself. Terminal agents compose with existing CLI tools rather than reimplementing them. `git`, `grep`, `curl`, and every other command-line tool is available without integration work.
- **Unix philosophy** — Do one thing well, compose with pipes. A skill that extracts data, piped into a skill that transforms it, piped into a skill that presents it. Each piece is testable and replaceable independently.

Here is what composition looks like in practice. A terminal agent piped into standard tools:

```bash
claude --print "list all TODO comments in src/" | grep "FIXME" | sort
```

The transparency of terminal agents is a practical advantage: you can see every command the agent runs, every file it reads, and every change it makes. When something goes wrong, the debugging surface is the shell history:

```bash
claude --verbose "add input validation to the signup handler"
```

The `--verbose` flag shows every tool call the agent makes as it works, so you can see exactly what it reads and writes.

## What comes next

The rest of the session covers:
- Chapter 2: The primitives that make agents extensible (skills, commands, sub-agents, rules)
- Chapter 3: Writing your own skill and building your pet
- Chapter 4: Watching your pet compete in the first race

## What you should have now

- A mental model for when AI agents are and are not the right tool
- An understanding of why decomposition is the key human skill
- Awareness of the five environments and why terminals are the focus
- Familiarity with KISS, DRY, and Unix philosophy as applied to agents
