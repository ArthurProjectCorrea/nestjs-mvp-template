---
applyTo: '**'
---

# Branch Strategy & Workflow Guide - PROJECT-A1-API

## 📋 Overview

This guide defines the complete branch strategy, naming conventions and workflow for PROJECT-A1-API. Following these practices ensures organized, secure and collaborative development.

## 🌳 Branch Strategy

### Main Branch

#### **`main`** - Main Branch

- **Purpose**: Production-ready code
- **Status**: Always stable and deployable
- **Protection**: ❌ Direct commits **BLOCKED**
- **Merge**: Only via Pull Request with review
- **Deploy**: Automatic via CI/CD after merge

### Development Base Branch

#### **Fundamental Rule: ALWAYS create branches from `main`**

```bash
# ✅ CORRECT - Always start from main
git checkout main
git pull origin main
git checkout -b feature/new-functionality

# ❌ INCORRECT - Never start from other branches
git checkout feature/other-branch  # ❌ Avoid
git checkout -b feature/my-branch  # ❌ Problematic
```

**Why always start from `main`?**

- ✅ Ensures stable code base
- ✅ Avoids unnecessary conflicts
- ✅ Facilitates code review
- ✅ Prevents bugs from other branches
- ✅ Simplifies merge process

## 🏷️ Branch Naming

### Mandatory Patterns

All branches must follow this naming convention:

#### 1. **Feature Branches** (New Features)

```
feature/<clear-description>
```

**Good Examples:**

- `feature/user-authentication`
- `feature/password-reset-flow`
- `feature/admin-dashboard`
- `feature/email-notifications`
- `feature/user-profile-update`

**Bad Examples:**

- `feature/fix` ❌ (too vague)
- `feature/updates` ❌ (not specific)
- `feature/Feature1` ❌ (uppercase)

**When to use:**

- Implement new functionality
- Add new endpoints
- Create new modules
- Implement new integration

#### 2. **Bugfix Branches** (Bug Fixes)

```
bugfix/<problem-description>
```

**Good Examples:**

- `bugfix/login-validation-error`
- `bugfix/memory-leak-users-service`
- `bugfix/null-pointer-auth-guard`
- `bugfix/duplicate-email-registration`

**When to use:**

- Fix bugs in development
- Resolve non-critical issues
- Fixes for identified issues

#### 3. **Hotfix Branches** (Urgent Fixes)

```
hotfix/<critical-description>
```

**Good Examples:**

- `hotfix/critical-security-vulnerability`
- `hotfix/production-crash-fix`
- `hotfix/data-corruption-patch`
- `hotfix/authentication-bypass`

**When to use:**

- Critical bugs in production
- Security vulnerabilities
- Issues that prevent application usage
- Fixes that cannot wait for next release

#### 4. **Release Branches** (Release Preparation)

```
release/v<major>.<minor>.<patch>
```

**Examples:**

- `release/v1.0.0`
- `release/v2.1.0`
- `release/v1.2.3`

**When to use:**

- Prepare new version for production
- Finalize features for release
- Apply final adjustments before deploy

#### 5. **Docs Branches** (Documentation)

```
docs/<documentation-description>
```

**Examples:**

- `docs/api-documentation-update`
- `docs/deployment-guide`
- `docs/architecture-diagrams`

**When to use:**

- Documentation updates
- New guides or tutorials
- Fixes to existing documentation

#### 6. **Chore Branches** (Maintenance)

```
chore/<maintenance-description>
```

**Examples:**

- `chore/update-dependencies`
- `chore/eslint-configuration`
- `chore/ci-pipeline-optimization`

**When to use:**

- Dependency updates
- Tool configurations
- CI/CD improvements
- Code refactoring

## 🔄 Complete Workflow

### 1. Environment Preparation

```bash
# Always start with clean environment
git status  # Check if there are no pending changes
git stash   # If necessary, save temporary changes

# Update main branch
git checkout main
git pull origin main
```

### 2. Branch Creation

```bash
# Create new branch from updated main
git checkout -b feature/feature-name

# Verify created branch
git branch  # Confirm you're on the new branch
```

### 3. Development

```bash
# Make changes to code
# ...

# Add changes to staging
git add .

# Commit using Commitizen (MANDATORY)
pnpm run commit

# Push branch to repository
git push -u origin feature/feature-name
```

### 4. Keep Branch Updated

```bash
# Periodically, update with main changes
git fetch origin
git rebase origin/main

# If there are conflicts, resolve and continue
git add .
git rebase --continue

# Force push if necessary (after rebase)
git push --force-with-lease origin feature/feature-name
```

### 5. Pull Request

1. **Create PR** on GitHub
2. **Fill template** completely
3. **Request review** from at least 1 person
4. **Wait for approval** and checks to pass
5. **Merge** will be done by reviewer

### 6. Cleanup

```bash
# After merge, delete local branch
git checkout main
git pull origin main
git branch -d feature/feature-name

# Delete remote branch (if not automatic)
git push origin --delete feature/feature-name
```

## 🛡️ Protection Rules

### Protected Branches

#### **`main`** - Full Protection

- ❌ **Direct commits BLOCKED**
- ✅ **Only Pull Requests**
- ✅ **Mandatory review** (minimum 1 person)
- ✅ **Status checks** must pass
- ✅ **Branch must be up to date**
- ✅ **Dismiss stale reviews** enabled
- ✅ **Administrators included** in rules

### Automatic Validation

#### Git Hooks (Husky)

```bash
# Pre-commit hooks validate:
✅ Branch name pattern
✅ Commit message format
✅ Code formatting (Prettier)
✅ Linting (ESLint)
✅ Tests pass

# Pre-push hooks validate:
✅ No direct push to main
✅ Tests pass before push
```

#### GitHub Actions

```bash
# CI Pipeline validates:
✅ Lint code quality
✅ Format check
✅ Build success
✅ Unit tests pass
✅ E2E tests pass
✅ Security scans
```

## 📏 Naming Rules

### ✅ Accepted Patterns

- **Lowercase only**: `feature/user-auth` ✅
- **Hyphens for separation**: `feature/password-reset` ✅
- **Alphanumeric and dots**: `release/v1.0.0` ✅
- **Underscores allowed**: `feature/api_v2` ✅
- **Descriptive and clear**: `bugfix/memory-leak-fix` ✅

### ❌ Rejected Patterns

- **Uppercase**: `Feature/UserAuth` ❌
- **Spaces**: `feature/user auth` ❌
- **Special characters**: `feature/user@auth` ❌
- **Too vague**: `feature/fix` ❌
- **Too long**: `feature/implement-complete-authentication-system-with-jwt-and-refresh-tokens` ❌

## 🚨 Troubleshooting

### Error: Branch Name Invalid

```bash
# Error shown:
ERROR: Branch name must follow pattern: feature/, bugfix/, hotfix/, etc.

# Solution: Rename branch
git branch -m feature/correct-name
```

### Error: Direct Commit to Main

```bash
# Error shown:
ERROR: Direct commits to 'main' branch are not allowed!

# Solution: Create feature branch
git checkout -b feature/my-change
git commit --amend --no-edit
```

### Error: Branch Out of Date

```bash
# Error: Branch diverged from main

# Solution 1: Rebase (recommended)
git fetch origin
git rebase origin/main

# Solution 2: Merge (if rebase is complex)
git fetch origin
git merge origin/main
```

### Error: Conflicts During Rebase

```bash
# 1. Resolve conflicts manually in files
# 2. Add resolved files
git add .

# 3. Continue rebase
git rebase --continue

# 4. If necessary, abort rebase
git rebase --abort
```

## 📚 Practical Examples

### Example 1: New Feature

```bash
# 1. Prepare environment
git checkout main
git pull origin main

# 2. Create branch
git checkout -b feature/user-profile-editor

# 3. Develop
# ... make code changes ...

# 4. Commit
git add .
pnpm run commit
# Choose: feat(users): add profile editor functionality

# 5. Push
git push -u origin feature/user-profile-editor

# 6. Create PR on GitHub
# 7. After merge, cleanup
git checkout main
git pull origin main
git branch -d feature/user-profile-editor
```

### Example 2: Urgent Hotfix

```bash
# 1. Prepare environment (directly from main)
git checkout main
git pull origin main

# 2. Create hotfix
git checkout -b hotfix/critical-auth-vulnerability

# 3. Apply fix
# ... fix problem ...

# 4. Commit
git add .
pnpm run commit
# Choose: fix(auth): resolve critical JWT vulnerability

# 5. Push and urgent PR
git push -u origin hotfix/critical-auth-vulnerability

# 6. PR to main with maximum priority
```

### Example 3: Update Branch During Development

```bash
# During long feature development
git fetch origin

# Check if main has updates
git log --oneline main..origin/main

# If there are updates, rebase
git rebase origin/main

# If there are conflicts, resolve and continue
git add .
git rebase --continue

# Update remote branch
git push --force-with-lease origin feature/my-branch
```

## 🔧 Useful Commands

### Status Verification

```bash
# Check current branch
git branch --show-current

# Check local branches
git branch

# Check remote branches
git branch -r

# Check repository status
git status

# Check if branch is up to date
git fetch origin
git status
```

### Branch Cleanup

```bash
# List merged branches
git branch --merged main

# Delete local merged branches
git branch --merged main | grep -v "main" | xargs -n 1 git branch -d

# Clean deleted remote branches
git remote prune origin

# See branches that can be deleted
git for-each-ref --format='%(refname:short) %(committerdate)' refs/heads | sort -k2
```

### Manual Validation

```bash
# Validate branch name
pnpm run branch:validate

# Check commit rules
pnpm run commit --dry-run

# Test build before push
pnpm run build
pnpm run test
pnpm run lint
```

## 📖 Best Practices

## 📚 Best Practices

### Development

1. **✅ Always start from `main`** updated
2. **✅ Small and focused branches** (1 functionality per branch)
3. **✅ Frequent commits** with clear messages
4. **✅ Test locally** before push
5. **✅ Keep branch updated** with main regularly

### Naming

1. **✅ Descriptive names** and specific
2. **✅ Lowercase and hyphens** only
3. **✅ Mandatory prefixes** (feature/, bugfix/, etc.)
4. **✅ Maximum 50 characters** for readability
5. **✅ Avoid obscure abbreviations**

### Collaboration

1. **✅ Detailed Pull Requests** with template
2. **✅ Mandatory code review** before merge
3. **✅ Resolve conflicts quickly**
4. **✅ Communicate changes** that affect others
5. **✅ Delete branches** after merge

### Maintenance

1. **✅ Regular cleanup** of old branches
2. **✅ Monitoring** of orphaned branches
3. **✅ Update** dependencies via specific branches
4. **✅ Backup** before destructive operations
5. **✅ Documentation** of important changes

## 🎯 Branch Checklist

### Before Creating Branch

- [ ] `git checkout main`
- [ ] `git pull origin main`
- [ ] `git status` (working tree clean)
- [ ] Branch name follows pattern
- [ ] Branch objective is clear

### During Development

- [ ] Frequent and clear commits
- [ ] `pnpm run commit` used
- [ ] Tests passing locally
- [ ] Branch updated with main
- [ ] Code formatted and no lint errors

### Before Push

- [ ] `pnpm run build` passed
- [ ] `pnpm run test` passed
- [ ] `pnpm run lint` passed
- [ ] `pnpm run format:check` passed
- [ ] Conflicts resolved

### Before PR

- [ ] Branch updated with main
- [ ] PR template filled
- [ ] Clear description of changes
- [ ] Reviewers requested
- [ ] Appropriate labels added

### After Merge

- [ ] Local branch deleted
- [ ] Remote branch deleted
- [ ] `git checkout main`
- [ ] `git pull origin main`
- [ ] Local environment updated

---

## ⚡ Quick Commands

```bash
# Quick setup for new feature
git checkout main && git pull origin main && git checkout -b feature/name

# Update current branch with main
git fetch origin && git rebase origin/main

# Initial push of new branch
git push -u origin $(git branch --show-current)

# Cleanup after merge
git checkout main && git pull origin main && git branch -d branch-name

# Validate before commit
pnpm run lint && pnpm run format && pnpm run test
```

---

**🎯 Remember: These rules are automatically enforced by Git hooks. Invalid branches and commits will be rejected!**

_Branch Strategy Guide - PROJECT-A1-API_
