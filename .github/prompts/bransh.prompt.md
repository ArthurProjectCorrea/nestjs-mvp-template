---
mode: ask
---

# Branch Name Suggestion Prompt

## Task Description

Analyze a provided issue file and suggest appropriate branch names for implementing the issue. The suggestions must follow the project's branch naming conventions and provide multiple options with clear justifications.

## Input Analysis

### Issue File Processing

1. **Read the issue file** provided by the user
2. **Extract key information**:
   - Issue type (feature request vs bug report)
   - Issue title and description
   - Technical requirements and scope
   - Affected components/modules
   - Priority and complexity indicators

3. **Determine branch type**:
   - **feature/**: For new functionality, enhancements, API additions
   - **bugfix/**: For bug fixes, error corrections, non-critical issues
   - **hotfix/**: For critical production issues, security vulnerabilities

## Branch Naming Rules

### Mandatory Conventions

All branch names must follow these patterns:

#### Feature Branches

```
feature/<clear-description>
```

- Use for new functionality, API endpoints, integrations
- Description should be clear and specific
- Use kebab-case (hyphens, no spaces)
- Maximum 50 characters

#### Bugfix Branches

```
bugfix/<problem-description>
```

- Use for bug fixes and error corrections
- Focus on the problem being solved
- Include affected component when relevant
- Keep concise but descriptive

#### Hotfix Branches

```
hotfix/<critical-description>
```

- Use only for critical production issues
- Include severity indicator when appropriate
- Focus on immediate impact resolution

## Suggestion Generation Process

### Issue Type Analysis

#### Feature Request Analysis

- Extract main functionality being added
- Identify affected modules/components
- Determine scope (single component vs multiple)
- Assess complexity and effort required

#### Bug Report Analysis

- Identify the specific problem/error
- Determine affected component
- Assess impact and urgency
- Extract error types or symptoms

### Branch Name Generation

#### Primary Suggestion

- **Most appropriate name** based on issue analysis
- **Follows conventions exactly**
- **Clear and descriptive**
- **Includes key technical terms**

#### Alternative Suggestions

- **2-3 additional options** with different focuses
- **Variations for different scopes**
- **Component-specific vs general names**
- **Different levels of specificity**

#### Technical Considerations

- **API endpoints**: Include main endpoint or resource
- **Database changes**: Reference schema or model changes
- **Authentication**: Use auth/security terminology
- **UI/Frontend**: Include component or feature names

## Output Format

### Suggested Branch Names

Provide suggestions in this format:

#### 🎯 **Primary Recommendation**

**Branch Name:** `feature/user-authentication-jwt`
**Justification:** Clear description of the main functionality being implemented

#### 🔄 **Alternative Options**

1. **`feature/jwt-auth-implementation`**
   - More concise version focusing on core technology

2. **`feature/authentication-system`**
   - Broader scope covering the entire auth module

3. **`feature/login-jwt-tokens`**
   - Specific focus on login and token functionality

### Selection Criteria

For each suggestion, include:

- **Clarity**: How clear and understandable the name is
- **Specificity**: How specific it is to the issue scope
- **Convention Compliance**: How well it follows naming rules
- **Technical Accuracy**: How accurately it reflects the implementation

## Quality Validation

### Pre-Suggestion Checks

- [ ] Issue type correctly identified
- [ ] Branch type appropriate for issue scope
- [ ] Naming conventions strictly followed
- [ ] Technical terms accurately used
- [ ] Length within reasonable limits

### Content Validation

- [ ] Names are descriptive and meaningful
- [ ] Follow kebab-case convention
- [ ] Include relevant technical keywords
- [ ] Avoid generic terms like "fix" or "update"
- [ ] Reflect actual scope of work

## Integration with Project Rules

### Branch Strategy Compliance

- Follow `branch.instructions.md` guidelines
- Use appropriate branch prefixes
- Maintain consistency with existing branches
- Consider merge and review implications

### Issue-to-Branch Mapping

- **Feature Requests** → `feature/` branches
- **Bug Reports** → `bugfix/` or `hotfix/` branches
- **Documentation** → `docs/` branches
- **Maintenance** → `chore/` branches

## Success Criteria

### Suggestion Quality

- [ ] Primary suggestion clearly identified
- [ ] Multiple viable alternatives provided
- [ ] Justifications explain reasoning
- [ ] Technical accuracy maintained
- [ ] Naming conventions strictly followed

### Practical Utility

- [ ] Names are easy to understand and remember
- [ ] Reflect actual implementation scope
- [ ] Work well in commit messages and PRs
- [ ] Follow project collaboration patterns

---

**Branch Name Suggestion Prompt - Ready for use when user requests branch name suggestions**
