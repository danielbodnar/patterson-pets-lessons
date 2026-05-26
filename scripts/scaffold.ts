#!/usr/bin/env bun

import { $ } from "bun";
import { existsSync } from "node:fs";
import { resolve, join } from "node:path";

const SKILL_ROOT = resolve(import.meta.dir, "..");

const TEMPLATE_FILES = [
  { src: "assets/README.md.template", dest: "README.md" },
  { src: "assets/HANDOFF.md.template", dest: "HANDOFF.md" },
  { src: "assets/AGENTS.md.template", dest: "AGENTS.md" },
  { src: "assets/bootstrap.sh.template", dest: "bootstrap.sh" },
];

function parseArgs(): string {
  const args = process.argv.slice(2);
  let target = "./patterson-ai-pets-workshop";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--target" && args[i + 1]) {
      target = args[i + 1];
    }
  }

  return resolve(target);
}

async function main() {
  const target = parseArgs();

  console.log("Patterson AI Pets Workshop — Repository Scaffold");
  console.log("=================================================\n");
  console.log(`Target: ${target}\n`);

  if (!existsSync(target)) {
    console.log("Creating target directory...");
    await $`mkdir -p ${target}`;
  }

  const isGitRepo = existsSync(join(target, ".git"));
  if (!isGitRepo) {
    console.log("Initializing git repository...");
    await $`git init ${target}`;
  } else {
    console.log("Git repository already exists.");
  }

  console.log("\nCopying templates...");
  for (const file of TEMPLATE_FILES) {
    const src = join(SKILL_ROOT, file.src);
    const dest = join(target, file.dest);
    console.log(`  ${file.src} → ${file.dest}`);
    const content = await Bun.file(src).text();
    await Bun.write(dest, content);
  }

  await $`chmod +x ${join(target, "bootstrap.sh")}`;

  console.log("\nCopying branch creation script...");
  const branchScriptSrc = join(SKILL_ROOT, "assets/create-branches.ts");
  const branchScriptDir = join(target, "scripts");
  const branchScriptDest = join(branchScriptDir, "create-branches.ts");

  if (!existsSync(branchScriptDir)) {
    await $`mkdir -p ${branchScriptDir}`;
  }

  const branchScript = await Bun.file(branchScriptSrc).text();
  await Bun.write(branchScriptDest, branchScript);

  console.log("\nCreating package.json...");
  const packageJson = {
    name: "patterson-ai-pets-workshop",
    version: "1.0.0",
    description: "Patterson AI Pets workshop: Mastering AI Coding Agents",
    type: "module",
    scripts: {
      test: "bun test",
      lint: "bunx oxlint .",
    },
  };
  await Bun.write(join(target, "package.json"), JSON.stringify(packageJson, null, 2) + "\n");

  console.log("Creating .github/workflows/osv-scanner.yml...");
  const workflowDir = join(target, ".github/workflows");
  if (!existsSync(workflowDir)) {
    await $`mkdir -p ${workflowDir}`;
  }
  await Bun.write(
    join(workflowDir, "osv-scanner.yml"),
    `name: OSV-Scanner

on:
  pull_request:
    branches: [ "main" ]
  merge_group:
    branches: [ "main" ]
  schedule:
    - cron: '21 18 * * 0'
  push:
    branches: [ "main" ]

permissions:
  security-events: write
  contents: read

jobs:
  scan-scheduled:
    if: \${{ github.event_name == 'push' || github.event_name == 'schedule' }}
    uses: "google/osv-scanner-action/.github/workflows/osv-scanner-reusable.yml@1f1242919d8a60496dd1874b24b62b2370ed4c78" # v1.7.1
    with:
      scan-args: |-
        -r
        --skip-git
        ./
  scan-pr:
    if: \${{ github.event_name == 'pull_request' || github.event_name == 'merge_group' }}
    uses: "google/osv-scanner-action/.github/workflows/osv-scanner-reusable-pr.yml@1f1242919d8a60496dd1874b24b62b2370ed4c78" # v1.7.1
    with:
      scan-args: |-
        -r
        --skip-git
        ./
`
  );

  const gitDir = join(target, ".git");
  if (existsSync(gitDir)) {
    console.log("\nCommitting base state on main...");

    await $`git add -A`.cwd(target).quiet();
    const status = await $`git status --porcelain`.cwd(target).quiet();
    if (status.text().trim() !== "") {
      await $`git commit -m ${"chore: scaffold workshop repository base"}`.cwd(target).quiet();
      console.log("Base state committed on main.");
    } else {
      console.log("Nothing to commit (base state already present).");
    }
  }

  console.log("\nRunning branch creation script...");
  await $`bun run scripts/create-branches.ts`.cwd(target);

  console.log("\nScaffold complete!");
  console.log(`Repository at: ${target}`);
  console.log("Branches created. Run 'git branch' in the repo to see them.");
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
