---
mode: agent
---

# Issue File Generation Prompt

## Task Description

Generate a properly formatted issue file in the `docs/issue/` directory based on information provided in a source file. The generated issue must follow the appropriate template (feature request or bug report) and contain all relevant technical details in proper technical English.

## Input Analysis

### Source File Processing

1. **Read the source file** provided by the user
2. **Extract key information**:
   - Issue type (feature request vs bug report)
   - Technical requirements or problem description
   - API endpoints, database changes, or error details
   - Implementation notes, constraints, or acceptance criteria
   - Any code examples, error messages, or reproduction steps

3. **Determine issue type**:
   - **Feature Request**: New functionality, enhancements, API additions, integrations
   - **Bug Report**: Errors, crashes, unexpected behavior, performance issues, security problems

## Template Selection and Mapping

### Feature Request Template (`docs/template/feature_request_template.md`)

Use when the source indicates:

- New API endpoints or functionality
- Database schema changes
- Integration requirements
- Performance improvements
- Security enhancements
- Configuration changes

**Required Sections to Fill:**

- Feature Description: Clear, technical description
- Feature Type: Mark appropriate checkbox
- Problem Statement: Current limitations and proposed solution
- Feature Requirements: Functional and non-functional requirements
- Technical Specifications: API design, database changes, dependencies
- Acceptance Criteria: Detailed definition of done
- Priority and Timeline: Based on technical assessment

### Bug Report Template (`docs/template/bug_report_template.md`)

Use when the source indicates:

- Error messages or application crashes
- Unexpected behavior or incorrect results
- Performance degradation
- Security vulnerabilities
- API failures or data corruption
- Configuration issues

**Required Sections to Fill:**

- Bug Description: Clear, technical problem description
- Bug Type: Mark appropriate severity and category
- Environment: Complete technical environment details
- Steps to Reproduce: Detailed, actionable reproduction steps
- Expected vs Actual Behavior: Clear comparison
- Evidence: Error messages, logs, code examples, API requests/responses
- Impact Assessment: Users affected and business impact
- Investigation: Troubleshooting steps and root cause analysis

## File Generation Rules

### File Naming Convention

Generate filename as: `{number}.{description}.md`

- **Number**: Next sequential number (check existing files in `docs/issue/`)
- **Description**: Clear, descriptive name in kebab-case
- **Examples**:
  - `09.add-user-profile-api-feature-request.md`
  - `10.fix-auth-token-validation-bug-report.md`

### Content Generation Guidelines

#### Technical English Requirements

- Use proper technical terminology
- Maintain consistent project-specific terms
- Write clear, concise, professional descriptions
- Include specific technical details (endpoints, error codes, data types)

#### Template Compliance

- **Copy template structure exactly**
- **Fill all applicable sections**
- **Use proper Markdown formatting**
- **Include code examples with syntax highlighting**
- **Provide concrete values, not placeholders**

#### Information Mapping

**From Source File:**

- Extract API endpoints, request/response formats
- Include error messages, stack traces, logs
- Map requirements to acceptance criteria
- Include code snippets, database schemas
- Extract environment details, constraints

**Technical Accuracy:**

- Use actual endpoint paths from the codebase
- Include real error messages and status codes
- Reference actual database tables and columns
- Include proper TypeScript types and interfaces

## Quality Validation

### Pre-Generation Checks

- [ ] Issue type correctly identified
- [ ] All template sections addressed
- [ ] Technical information accurate
- [ ] Language is proper technical English
- [ ] File naming follows convention
- [ ] Markdown formatting is correct

### Content Validation

- [ ] No placeholder text remains
- [ ] All code examples are functional
- [ ] API examples include proper HTTP methods and headers
- [ ] Error messages are exact copies
- [ ] Environment details are complete
- [ ] Reproduction steps are actionable

## Output Requirements

### File Creation

- **Location**: `docs/issue/{filename}.md`
- **Format**: Valid Markdown with proper syntax
- **Encoding**: UTF-8
- **Line Endings**: LF (Unix style)

### Content Structure

**Header Information:**

- Appropriate template used
- All checkboxes properly marked
- Technical details accurately represented
- Code examples properly formatted

**Completeness:**

- No empty required sections
- All relevant information included
- Cross-references to related issues/PRs
- Proper priority and impact assessment

## Error Handling

### Insufficient Information

If source file lacks required information:

- Include all available data
- Mark incomplete sections with "TBD" or "To be determined"
- Request additional information from user
- Generate issue with best available information

### Ambiguous Issue Type

If issue type is unclear:

- Analyze content for keywords and context
- Choose most appropriate template
- Include reasoning in issue description
- Ask user to confirm or clarify if needed

### Technical Issues

If technical details are missing:

- Use generic but accurate technical descriptions
- Include implementation notes from source
- Mark areas needing clarification
- Provide reasonable assumptions based on context

## Integration Requirements

### Project Standards Compliance

- Follow issue.instructions.md guidelines
- Use technical English (Rule 4 compliance)
- Maintain documentation standards (Rule 6)
- Follow centralized documentation structure (Rule 13)

### File Organization

- Place in correct directory: `docs/issue/`
- Follow naming convention strictly
- Ensure file is properly committed
- Update any related documentation indexes

## Success Criteria

### Generated Issue Quality

- [ ] Uses correct template for issue type
- [ ] Contains all relevant technical information
- [ ] Written in proper technical English
- [ ] Follows proper Markdown formatting
- [ ] Includes actionable next steps
- [ ] Properly prioritized and categorized
- [ ] Self-contained and complete

### Process Compliance

- [ ] File created in correct location
- [ ] Naming convention followed
- [ ] All validation checks passed
- [ ] Template structure preserved
- [ ] Technical accuracy verified

---

**Issue Generation Prompt - Ready for use when user requests issue file creation**
