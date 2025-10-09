---
mode: agent
---

# Pull Request File Generation Prompt

## Task Description

Generate a properly formatted pull request file in the `docs/pull_request/` directory based on the current branch changes. The generated PR must follow the pull_request_template.md and contain comprehensive technical details about the implementation, testing, and deployment requirements.

## Branch Analysis Process

### Current Branch Examination

1. **Analyze branch name and purpose**:
   - Extract feature/bugfix type from branch naming convention
   - Understand the scope and objective of changes
   - Identify main functionality being implemented

2. **Examine git status and changes**:
   - Review staged and unstaged changes
   - Identify modified, added, and deleted files
   - Analyze the scope of changes (small vs large)

3. **Review commit history**:
   - Examine commit messages following Conventional Commits
   - Identify primary change type (feat, fix, refactor, etc.)
   - Extract technical implementation details from commits

### Technical Change Classification

#### Primary Change Types

**feat (New Feature)**:

- New API endpoints or functionality
- Database schema additions
- New modules or services
- Integration with external services

**fix (Bug Fix)**:

- Error corrections and bug fixes
- Security vulnerability patches
- Performance issue resolutions
- Data corruption fixes

**refactor (Code Restructuring)**:

- Code reorganization without behavior changes
- Architecture improvements
- Code quality enhancements
- Technical debt reduction

**perf (Performance)**:

- Query optimizations
- Caching implementations
- Algorithm improvements
- Resource usage reductions

**test (Testing)**:

- New test coverage additions
- Test framework updates
- CI/CD testing improvements

**chore (Maintenance)**:

- Dependency updates
- Configuration changes
- Build tool updates
- Documentation maintenance

## Template Mapping and Population

### Pull Request Template Structure

Use `docs/template/pull_request_template.md` as the base template and populate all sections:

#### Description Section

- **Clear technical summary**: What was implemented and why
- **Scope definition**: Which parts of the system were affected
- **Impact description**: How users/system will be affected

#### Type of Change Section

Mark appropriate checkboxes based on analysis:

- [x] **feat** - New feature or functionality
- [x] **fix** - Bug fix or correction
- [x] **docs** - Documentation changes only
- [x] **style** - Code style/formatting (no logic changes)
- [x] **refactor** - Code restructuring (no behavior changes)
- [x] **test** - Adding or updating tests
- [x] **chore** - Maintenance tasks, dependencies, configs
- [x] **perf** - Performance improvements
- [x] **ci** - CI/CD pipeline changes
- [x] **build** - Build system or external dependencies

#### Changes Made Section

- **File-by-file breakdown**: List specific files modified
- **Technical implementation details**: Describe what was changed
- **New dependencies**: List added packages and versions
- **Configuration updates**: Environment variables, Docker changes
- **Database migrations**: Schema changes and migration details

#### Motivation and Context Section

- **Problem statement**: What issue was being solved
- **Business/technical requirements**: Why this change was needed
- **Alternative solutions considered**: Other approaches evaluated
- **Decision rationale**: Why this implementation was chosen

#### Checklist Section

Verify and mark completed items:

- [x] Code follows the project's style guidelines
- [x] Self-review of code has been performed
- [x] Code is commented, particularly in hard-to-understand areas
- [x] Documentation has been updated (if needed)
- [x] Changes generate no new warnings or errors
- [x] Unit tests have been added/updated (if applicable)
- [x] All tests pass locally (`pnpm test`)
- [x] Linting passes (`pnpm run lint`)
- [x] Formatting is correct (`pnpm run format:check`)
- [x] E2E tests pass (if applicable)

#### Related Issues Section

- **GitHub issue links**: Reference related issues using `#issue-number`
- **Dependencies**: Link to other PRs or issues
- **Feature requests**: Connect to original requirements

#### Testing Instructions Section

- **Setup requirements**: How to prepare test environment
- **Step-by-step testing**: Specific actions to validate changes
- **Expected results**: What should happen when tests pass
- **Edge cases**: Special scenarios to test

#### Deployment Notes Section

- **Migration requirements**: Database migrations needed
- **Environment variables**: New configs required
- **Service dependencies**: Redis, databases, external services
- **Breaking changes**: Backward compatibility issues
- **Rollback procedures**: How to revert if needed

## File Generation Rules

### File Naming Convention

Generate filename as: `{number}.{description}.md`

- **Number**: Next sequential number (check existing files in `docs/pull_request/`)
- **Description**: Clear, descriptive name in kebab-case based on branch/feature
- **Examples**:
  - `08.refresh-token-blacklist-implementation.md`
  - `09.add-user-profile-api.md`
  - `10.fix-auth-token-validation.md`

### Content Generation Guidelines

#### Technical English Requirements

- Use proper technical terminology throughout
- Maintain consistent project-specific terms
- Write clear, concise, professional descriptions
- Include specific technical details and file paths

#### Template Compliance

- **Copy template structure exactly**
- **Fill all applicable sections completely**
- **Use proper Markdown formatting**
- **Include code examples with syntax highlighting**
- **Provide concrete values, not placeholders**

#### Information Sources

**From Git Analysis:**

- Branch name and purpose
- Commit messages and types
- Modified files and directories
- Lines of code changed

**From Code Changes:**

- New API endpoints and their specifications
- Database schema modifications
- Configuration file updates
- Test coverage changes

**From Project Context:**

- Technology stack and frameworks used
- Project architecture and patterns
- Existing conventions and standards

## Quality Validation

### Pre-Generation Checks

- [ ] Current branch properly analyzed
- [ ] All template sections addressable
- [ ] Technical information accurate
- [ ] Language is proper technical English
- [ ] File naming follows convention

### Content Validation

- [ ] No placeholder text remains
- [ ] All code examples are accurate
- [ ] File paths and references are correct
- [ ] Commit types properly identified
- [ ] Testing and deployment notes complete

## Output Requirements

### File Creation

- **Location**: `docs/pull_request/{filename}.md`
- **Format**: Valid Markdown with proper syntax
- **Encoding**: UTF-8
- **Line Endings**: LF (Unix style)

### Content Structure

**Header Information:**

- Appropriate change types marked
- Technical details accurately represented
- Implementation scope clearly defined
- Testing and deployment requirements specified

**Completeness:**

- No empty required sections
- All relevant information included
- Cross-references to related work
- Proper prioritization and categorization

## Error Handling

### Insufficient Branch Information

If branch analysis lacks required information:

- Include all available technical details
- Mark incomplete sections with "TBD" or "To be determined"
- Request additional information from developer
- Generate PR with best available information

### Ambiguous Changes

If change scope is unclear:

- Analyze commit messages and file changes thoroughly
- Choose most appropriate classification
- Include reasoning in PR description
- Ask for clarification if needed

### Technical Details Missing

If technical details are incomplete:

- Use generic but accurate technical descriptions
- Include implementation notes from commits
- Mark areas needing clarification
- Provide reasonable assumptions based on context

## Integration Requirements

### Project Standards Compliance

- Follow pull_request.instructions.md guidelines
- Use technical English (Rule 4 compliance)
- Maintain documentation standards (Rule 6)
- Follow centralized documentation structure (Rule 13)

### File Organization

- Place in correct directory: `docs/pull_request/`
- Follow naming convention strictly
- Ensure file is properly committed
- Update any related documentation indexes

## Success Criteria

### Generated Pull Request Quality

- [ ] Uses correct template structure
- [ ] Contains all relevant technical information
- [ ] Written in proper technical English
- [ ] Follows proper Markdown formatting
- [ ] Includes actionable testing instructions
- [ ] Properly prioritized and categorized
- [ ] Self-contained and complete

### Process Compliance

- [ ] File created in correct location
- [ ] Naming convention followed
- [ ] All validation checks passed
- [ ] Template structure preserved
- [ ] Technical accuracy verified

---

**Pull Request Generation Prompt - Ready for use when user requests PR file creation**
