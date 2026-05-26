# Lesson 00: Opening and Setup

## Objectives

By the end of this lesson, every participant has a working environment with all three coding agents available and has verified that the environment is functional.

## Welcome to Patterson AI Pets

Patterson AI Pets is a team-based competitive coding game. Each team designs and maintains an autonomous coding agent represented as a pet avatar. The agent lives in a GitHub repository the team controls. Teams compete in periodic races called Shows, where every pet receives the same coding challenge and attempts to solve it autonomously. A judge agent reviews each submission against a published rubric and merges or rejects the work.

You are here to learn how AI coding agents work, how to build them, and how to make yours compete. By the end of this session you will have a working pet entered into The Show.

## What you will leave with

- A working understanding of how AI coding agents are structured and extended
- Hands-on experience with skills, commands, sub-agents, and rules
- A pet repository entered into The Show and ready for the first race
- Three coding agents installed and configured: Claude Code, OpenCode, and GitHub Copilot CLI

## Fork and clone the repository

1. Navigate to the workshop repository on GitHub
2. Click **Fork** to create your own copy
3. Clone your fork to your local machine:

```bash
git clone https://github.com/YOUR-USERNAME/patterson-pets-lessons.git
```

```bash
cd patterson-pets-lessons
```

If you prefer GitHub Codespaces, click the green **Code** button on your fork and select **Open with Codespaces** instead.

## Bootstrap the environment

Run the bootstrap script from the repository root:

```bash
./bootstrap.sh
```

The bootstrap script checks for mise, installs all tool versions, runs `just bootstrap` to install dependencies, and verifies that every required tool is available. You should see a pass/fail report for each tool.

If any tool fails verification, raise your hand. The instructor will help troubleshoot.

## Verify tool versions

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

## Verify the three agents

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

## What you should have now

- A forked and cloned copy of the workshop repository
- A verified environment with bun, gh, mise, just, and all three coding agents
- Familiarity with launching each agent from the terminal
