---
applyTo: '**'
---

# Pull Request Generation Instructions

This document defines the comprehensive guidelines for generating pull request files in the PROJECT-A1-API repository. These instructions ensure consistent, professional, and actionable pull request documentation.

## Overview

Pull request files are generated in the `docs/pull_request/` directory using the standardized template. The system analyzes the current branch changes and creates comprehensive PR documentation that includes technical details, testing information, and deployment notes.

## Pull Request File Structure

### File Naming Convention

Pull request files follow this pattern: `{number}.{description}.md`

- **Number**: Sequential numbering (01, 02, 03, etc.)
- **Description**: Clear, descriptive name in kebab-case based on branch/feature
- **Extension**: `.md` for Markdown format

**Examples:**

- `08.refresh-token-blacklist-implementation.md`
- `09.add-user-profile-api.md`
- `10.fix-auth-token-validation.md`

### File Location

All pull request files are stored in: `docs/pull_request/`

## Content Standards

### Language Requirements

- **Technical English Only**: All content must be written in technical English
- **Consistent Terminology**: Use project-specific terms consistently
- **Professional Tone**: Maintain professional, technical communication
- **Clear Descriptions**: Be specific and actionable

### Template Compliance

Pull requests must strictly follow the template: `docs/template/pull_request_template.md`

### Content Quality

#### Completeness

- **All sections filled**: Every template section must be addressed
- **Relevant information only**: Include only pertinent details
- **Evidence provided**: Support claims with test results, coverage reports
- **Actionable descriptions**: Provide clear implementation details

#### Technical Accuracy

- **Correct API endpoints**: Use actual endpoint paths and methods
- **Accurate commit messages**: Reference actual Conventional Commits
- **Proper code examples**: Include functional, tested code snippets
- **Environment details**: Include complete technical environment

## Generation Process

### Branch Analysis

When generating a pull request file:

1. **Analyze current branch**: Examine git status and recent commits
2. **Extract technical changes**: Identify modified files, new features, bug fixes
3. **Determine change type**: Classify as feat, fix, refactor, etc. based on commits
4. **Map to template sections**: Populate template with relevant technical details

### Change Type Determination

#### Based on Commit Messages (Conventional Commits)

- **feat**: New features, API endpoints, functionality additions
- **fix**: Bug fixes, error corrections, security patches
- **refactor**: Code restructuring without behavior changes
- **perf**: Performance improvements
- **docs**: Documentation updates
- **test**: Test additions or modifications
- **chore**: Maintenance, dependencies, configuration

#### Based on File Changes

- **New API endpoints**: Check for new controller methods, routes
- **Database changes**: Look for Prisma schema modifications, migrations
- **Security features**: Identify authentication, authorization changes
- **Testing additions**: New test files, increased coverage
- **Configuration updates**: Environment variables, Docker changes

### Template Section Mapping

**Description:**

- Clear, technical summary of what the PR implements
- Reference the main feature or fix being delivered
- Include scope and impact of changes

**Type of Change:**

- Mark appropriate checkboxes based on commit analysis
- Primary type should match main commit type
- Multiple types can be marked if applicable

**Changes Made:**

- List specific files modified
- Describe technical implementation details
- Include new dependencies or configurations
- Reference database migrations or API changes

**Motivation and Context:**

- Explain why changes were necessary
- Reference related issues or requirements
- Describe problems solved or features added

**Checklist:**

- Verify all items based on actual implementation
- Confirm testing completion and standards compliance
- Validate documentation and code quality

**Related Issues:**

- Link to GitHub issues using proper format
- Reference feature requests or bug reports
- Include dependencies between PRs

**Testing Instructions:**

- Provide specific steps to test the changes
- Include API endpoints to test
- Describe expected behavior and validation steps

**Deployment Notes:**

- Note any special deployment requirements
- Mention database migrations needed
- Include environment variable additions
- Specify service restarts or cache clearing

## Quality Assurance

### Validation Rules

Before finalizing a pull request file:

- [ ] Branch changes accurately analyzed
- [ ] Template sections properly filled
- [ ] Technical information correct and complete
- [ ] Language is proper technical English
- [ ] File naming follows convention
- [ ] Commit references are accurate

### Review Process

Generated pull requests should be:

- **Self-contained**: All information needed to understand and review
- **Actionable**: Clear next steps for reviewers and testers
- **Complete**: No missing required information
- **Professional**: Follows project standards and conventions

## Integration with Project Rules

This system integrates with:

- **Rule 4**: Language standardization (technical English)
- **Rule 6**: Documentation standards
- **Rule 13**: Documentation organization
- **Rule 8**: Version control and commit standards
- **Rule 14**: Controlled commit operations

## Best Practices

### Content Guidelines

1. **Be Specific**: Use concrete examples and exact file paths
2. **Provide Context**: Explain the technical implementation approach
3. **Include Evidence**: Reference test results and coverage reports
4. **Link Commits**: Reference specific commits when relevant
5. **Describe Impact**: Explain how changes affect users and system

### Maintenance

- **Regular Updates**: Update PR files as implementation progresses
- **Status Tracking**: Mark completion status and review state
- **Archive Completed**: Move merged PRs to archive folder
- **Template Updates**: Update templates based on feedback

## Error Handling

### Insufficient Information

If branch analysis lacks required information:

- Include all available technical details
- Mark incomplete sections clearly
- Request additional information from developers
- Generate PR with best available information

### Ambiguous Changes

If change scope is unclear:

- Analyze commit messages and file changes thoroughly
- Choose most appropriate classification
- Include reasoning in PR description
- Ask for clarification if needed

### Technical Issues

If technical details are missing:

- Use generic but accurate technical descriptions
- Include implementation notes from commits
- Mark areas needing clarification
- Provide reasonable assumptions based on context

---

**Pull Request Generation Guidelines - PROJECT-A1-API**
Follow these instructions to create professional, comprehensive pull request documentation.
