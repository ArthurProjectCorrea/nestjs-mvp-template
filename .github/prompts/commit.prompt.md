---
mode: agent
---

# Commitizen Form Generator

Analyze staged changes and generate a complete report with answers ready to fill the Commitizen (cz) interactive form.

## Workflow

### 1. Staged Files Discovery

- Run `git status --short` to identify all staged files
- For each staged file:
  - Get the diff using `git diff --staged <file>`
  - Read file content to understand context
  - Identify the nature of modifications

### 2. Change Classification

Analyze and determine:

- **Type**: Select one from:
  - `feat` - New feature or functionality
  - `fix` - Bug fix or correction
  - `docs` - Documentation changes only
  - `style` - Code style/formatting (no logic changes)
  - `refactor` - Code restructuring (no behavior changes)
  - `test` - Adding or updating tests
  - `chore` - Maintenance tasks, dependencies, configs
  - `perf` - Performance improvements
  - `ci` - CI/CD pipeline changes
  - `build` - Build system or external dependencies
  - `revert` - Revert previous commit

- **Scope**: Single word identifying the affected area (e.g., `auth`, `api`, `database`, `config`)

- **Subject**: Imperative mood, lowercase, max 72 characters (e.g., "add user authentication endpoint")

- **Body**: Detailed technical explanation:
  - What changed and why
  - Technical implementation details
  - Context and motivation
  - Single paragraph format (use `\n\n` for line breaks if needed)

- **Breaking Changes**: If applicable, describe:
  - What breaks backward compatibility
  - Migration steps required
  - Affected APIs or interfaces

- **Issues**: Reference related issue numbers (e.g., "#issue-number", "closes #issue-number")

### 3. Report Format

Generate output in this exact structure:

```
=== COMMITIZEN FORM ANSWERS ===

Type: <type>
Scope: <scope>
Subject: <subject>

Body:
<detailed body text>

Breaking Changes:
<breaking changes or "None">

Issues:
<issue references or "None">

=== END OF REPORT ===
```

## Guidelines

- Write all content in technical English
- Use imperative mood for subject ("add" not "added" or "adds")
- Keep subject concise and clear
- Provide meaningful context in body
- Be specific about technical details
- Follow conventional commits specification
- Ensure answers are copy-paste ready for the cz form
