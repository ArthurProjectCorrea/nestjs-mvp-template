---
applyTo: '**'
---

# Issue Generation Instructions

This document defines the comprehensive guidelines for generating issue files in the PROJECT-A1-API repository. These instructions ensure consistent, professional, and actionable issue documentation.

## Overview

Issue files are generated in the `docs/issue/` directory using standardized templates. The system supports two types of issues:

1. **Feature Requests** - New functionality or enhancements
2. **Bug Reports** - Problems, errors, or unexpected behavior

## Issue File Structure

### File Naming Convention

Issue files follow this pattern: `{number}.{description}.md`

- **Number**: Sequential numbering (01, 02, 03, etc.)
- **Description**: Clear, descriptive name in kebab-case
- **Extension**: `.md` for Markdown format

**Examples:**

- `01.create-user-crud-feature-request.md`
- `02.fix-login-validation-bug-report.md`
- `03.add-email-notifications-feature-request.md`

### File Location

All issue files are stored in: `docs/issue/`

## Content Standards

### Language Requirements

- **Technical English Only**: All content must be written in technical English
- **Consistent Terminology**: Use project-specific terms consistently
- **Professional Tone**: Maintain professional, technical communication
- **Clear Descriptions**: Be specific and actionable

### Template Compliance

Issues must strictly follow the appropriate template:

- **Feature Requests**: Use `docs/template/feature_request_template.md`
- **Bug Reports**: Use `docs/template/bug_report_template.md`

### Content Quality

#### Completeness

- **All sections filled**: Every template section must be addressed
- **Relevant information only**: Include only pertinent details
- **Evidence provided**: Support claims with data/logs/screenshots
- **Actionable descriptions**: Provide clear reproduction steps

#### Technical Accuracy

- **Correct API endpoints**: Use actual endpoint paths and methods
- **Accurate error messages**: Copy exact error messages
- **Proper code examples**: Include functional, tested code snippets
- **Environment details**: Include complete environment information

## Generation Process

### Input Analysis

When generating an issue file:

1. **Identify Issue Type**: Determine if it's a feature request or bug report
2. **Extract Information**: Parse the provided source file for relevant details
3. **Map to Template**: Map extracted information to appropriate template sections
4. **Validate Content**: Ensure all required fields are populated

### Issue Type Determination

#### Feature Request Indicators

- New functionality requests
- API endpoint additions
- Database schema changes
- Integration requirements
- Performance improvements
- Security enhancements

#### Bug Report Indicators

- Error messages or crashes
- Unexpected behavior
- Performance issues
- Security vulnerabilities
- API failures
- Data inconsistencies

### Content Mapping

#### From Source Files

Extract relevant information from:

- **Code comments**: Implementation notes, TODOs, FIXMEs
- **Commit messages**: Recent changes that might be related
- **Test failures**: Error details and reproduction steps
- **Documentation**: API specs, requirements, constraints
- **User feedback**: Reported issues or feature requests

#### Template Section Mapping

**Feature Requests:**

- Title → Clear, descriptive feature name
- Description → Detailed explanation of functionality
- Requirements → Functional and non-functional specs
- API Design → Endpoint specifications
- Acceptance Criteria → Definition of done

**Bug Reports:**

- Title → Clear description of the problem
- Steps to Reproduce → Detailed reproduction steps
- Expected vs Actual → Clear behavior comparison
- Evidence → Logs, screenshots, error messages
- Environment → Complete system information

## Quality Assurance

### Validation Rules

Before finalizing an issue file:

- [ ] **Template Compliance**: All required sections present
- [ ] **Language Check**: Technical English throughout
- [ ] **Information Accuracy**: All details verified and correct
- [ ] **Completeness**: No placeholder text remaining
- [ ] **Formatting**: Proper Markdown syntax
- [ ] **File Naming**: Follows naming convention

### Review Process

Generated issues should be:

- **Self-contained**: All information needed to understand and act
- **Actionable**: Clear next steps for developers
- **Prioritized**: Appropriate priority level assigned
- **Linked**: Related issues and dependencies noted

## Integration with Project Rules

This system integrates with:

- **Rule 4**: Language standardization (technical English)
- **Rule 6**: Documentation standards
- **Rule 13**: Documentation organization
- **Commit Guidelines**: Issue references in commits
- **Branch Strategy**: Feature branches for issue implementation

## Best Practices

### Content Guidelines

1. **Be Specific**: Use concrete examples and exact values
2. **Provide Context**: Explain why the issue matters
3. **Include Evidence**: Support claims with data
4. **Suggest Solutions**: When appropriate, include proposed fixes
5. **Link Related Work**: Reference related issues or PRs

### Maintenance

- **Regular Review**: Periodically review and update issue files
- **Status Updates**: Mark issues as resolved when completed
- **Archive Old Issues**: Move completed issues to archive folder
- **Template Updates**: Update templates based on feedback

## Error Handling

### Common Issues

- **Missing Information**: Request clarification from user
- **Ambiguous Type**: Ask for clarification on issue classification
- **Incomplete Data**: Note missing information in the issue
- **Template Mismatch**: Ensure correct template is used

### Fallback Procedures

If generation fails:

1. Use the most appropriate template
2. Include all available information
3. Mark incomplete sections clearly
4. Request additional information from user

---

**Issue Generation Guidelines - PROJECT-A1-API**
Follow these instructions to create professional, actionable issue documentation.
