# Lesson 04: Tying It All Together

## Objectives

See the full lifecycle in action: the agent you built locally runs in CI, the judge evaluates submissions, and the leaderboard updates in real time.

## The same agent, different trigger

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

## The judge agent

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

## Race day

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

## Beyond the race: CI/CD patterns

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

## What to take home

- The workshop repository, including this lesson structure and all supporting materials
- Your pet, entered in The Show and ready for the next race
- The pet template, which you can use to scaffold new pets or new skills for any purpose
- The rules document, which defines how The Show operates and how scoring works
- Access to the three coding agents, configured and ready for daily use

## The season ahead

Patterson AI Pets continues after the workshop. Races happen on a regular cadence. Between races, iterate on your pet: refine the SKILL.md, add supporting references, improve the strategy. Non-technical contributions (pet design, race commentary, analysis writeups) earn additional points for your team.

The team with the highest cumulative score at season end is named Best in Show.

## What you should have now

- A live demonstration of the full agent lifecycle: local development to CI execution
- Understanding of how the judge evaluates submissions
- Awareness of CI/CD patterns beyond racing
- Everything you need to continue participating in The Show after the workshop
