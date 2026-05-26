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
3. Clone your fork to your local machine or open it in GitHub Codespaces

#### Bootstrap the environment

Run the bootstrap script from the repository root:

```bash
./bootstrap.sh
```

The bootstrap script checks for mise, installs all tool versions, runs `just bootstrap` to install dependencies, and verifies that every required tool is available. You should see a pass/fail report for each tool.

If any tool fails verification, raise your hand. The instructor will help troubleshoot.

#### Verify the three agents

Open three terminal windows or tabs. In each one, launch a different agent:

- Terminal 1: `claude` (Claude Code)
- Terminal 2: `opencode` (OpenCode)
- Terminal 3: `gh copilot` (GitHub Copilot CLI)

Ask each agent the same question: "What files are in this repository?" Compare the responses. Notice how each agent discovers and presents the same information differently.

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

Success or failure with AI coding agents hinges on how well the human decomposes the problem before handing it to the agent. This is the skill that separates effective AI users from ineffective ones, and it is the same skill that separates effective engineers from ineffective ones.

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
- **Unix philosophy** — Do one thing well, compose with pipes. A skill that extracts data, piped into a skill that transforms it, piped into a skill that presents it. Each piece is testable and replaceable independently.

The transparency of terminal agents is a practical advantage: you can see every command the agent runs, every file it reads, and every change it makes. When something goes wrong, the debugging surface is the shell history.

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

The workshop repository's own `AGENTS.md` is the example. Open it now and read through it. Notice that it documents pre-existing infrastructure (the Show repository, the Cloudflare endpoints, the judge skill) that no amount of code-reading would reveal.

#### Anatomy of AGENTS.md

A well-written AGENTS.md answers one question per section: what would the agent get wrong without being told this?

- **Stack and tooling** — Languages, runtimes, version pins. The agent should not have to infer this from package.json.
- **Conventions** — Naming patterns, file organization, formatting rules beyond what the linter enforces.
- **Forbidden zones** — Files the agent must not modify. Migration files, generated code, vendored content.
- **Pre-existing infrastructure** — Everything that exists but is not visible from the repo tree. Deployed services, environment variables, external APIs.
- **How to work** — Workflows for testing, validating, formatting commits, opening pull requests.

Generic advice the agent already knows ("write clear code") fails the test and should be removed. Every line in AGENTS.md occupies context for the entire session. Treat it as the most expensive comment in the codebase.

#### The four primitives

Agents are extended through four primitives:

**Skills** are self-contained instruction sets the agent consults when relevant. A skill lives in a directory with a `SKILL.md` entry file and optional `scripts/`, `references/`, and `assets/` subdirectories. Skills trigger based on their description field: when the user's request matches what the skill describes, the agent loads and follows its instructions.

**Commands** are user-invoked shortcuts. In Claude Code, a file at `.claude/commands/deploy.md` creates a `/deploy` command the user can type. Commands and skills have been merged in Claude Code: a skill at `.claude/skills/deploy/SKILL.md` also creates a `/deploy` invocation. The distinction matters in other agents.

**Sub-agents** are specialized workers the agent dispatches for focused tasks. The parent agent coordinates; the sub-agent executes. Sub-agents are useful for parallelizing independent work or for isolating a task that requires a different set of tools.

**Rules** are constraints the agent must follow. Rules live in `.claude/rules/*.md` and can be scoped to specific file patterns using `paths:` frontmatter. Rules are always in context, so they should be short and specific.

#### MCP servers

MCP (Model Context Protocol) servers extend the agent's available tools. An MCP server is a process that exposes tools, resources, and prompts over a standard protocol. When an agent connects to an MCP server, the server's tools appear alongside the agent's built-in tools.

The configuration lives in `.mcp.json` at the repository root. The workshop does not go deeper into MCP server development, but knowing that the mechanism exists is important because several of the pre-provisioned services (Cloudflare Docs, Context7) are available as MCP servers.

#### Hands-on: Install a skill

Install a skill from the community directory:

```bash
npx skills add <skill-name>
```

Confirm the company-wide judge skill is present in the workshop environment. The judge was installed at the organization scope, so it appears automatically without per-team configuration.

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

```
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

The SKILL.md frontmatter must include:

- `name` — The pet's name in kebab-case. Must match the directory name.
- `description` — What the pet does and when the judge should consider it. This is the primary triggering mechanism. Write it specifically and slightly pushy.
- `metadata` — Optional fields for team name, breed, and lore tags.

The body contains the pet's instructions for solving challenges. Focus on the pet's strategy: what kinds of problems it approaches, how it decomposes work, what engineering standards it enforces, and what it refuses to do. A focused, well-described pet outperforms a verbose one because the judge reads the SKILL.md under a context budget.

#### The hierarchical skill structure

Skills operate at three levels:

1. **Company-wide** — Installed at the organization scope. Every agent in every team picks these up automatically. The judge is a company-wide skill.
2. **Personal** — Installed for a specific user. Personal preferences, workflow shortcuts, and cross-project tools.
3. **Project** — Lives in the repository. The pet itself is a project-level skill.

The hierarchy means that the judge (company-wide) automatically governs every pet (project-level) without per-team configuration. When a pet opens a pull request, the judge skill activates because it matches the review context, evaluates the submission against the rubric, and merges or rejects.

#### Push, test, and submit

Push your pet repository to GitHub:

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

- **Allow lists** — Explicitly enumerate the tools and file patterns the pet may use. Everything else is denied.
- **Deny lists** — Explicitly block dangerous operations: force pushes, secret access, network calls to unexpected endpoints.
- **Pre-tool-use hooks** — Code that runs before the agent executes a tool call. The hook can inspect the call and reject it before damage is done.

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

The scoring creates a real tradeoff between capability and economy. A pet that solves the challenge perfectly but burns excessive tokens scores lower than a focused pet that solves it cleanly. This mirrors the actual constraints of using AI agents in production.

#### Race day

All registered pets receive the workshop's first challenge simultaneously. The sequence:

1. The challenge is posted to the Show repository
2. Each pet's CI workflow detects the new challenge and triggers the pet agent
3. Each pet reads the challenge, consults its SKILL.md, and produces a pull request
4. The judge reviews each submission as it arrives
5. The leaderboard updates as scores are finalized

You watch but do not intervene. The hands-off character is deliberate: it mirrors production use of autonomous agents, where preparation is the work and the run is the evaluation.

If time permits, review another team's pet repository to see how a different approach scored. Cross-team learning is one of the game's design goals.

#### Beyond the race: CI/CD patterns

The same primitive that powers the race supports other CI/CD workflows:

- **Issue triage** — A skill that reads new issues, categorizes them, and assigns labels or team members
- **Dependency updates** — A skill that monitors for outdated packages and opens upgrade pull requests
- **Scheduled maintenance** — A skill that runs periodic checks (security scans, license audits) and files issues for findings
- **Code review** — The judge itself, repurposed as a general-purpose review agent for production pull requests

Each of these is a skill. Each can be installed at the company, personal, or project level. Each runs the same in CI as it does locally.

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
