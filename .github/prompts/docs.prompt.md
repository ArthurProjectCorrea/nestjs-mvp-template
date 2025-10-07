---
mode: agent
---

# Documentation Generation System

This prompt system handles comprehensive project documentation generation and maintenance.

## Available Commands

### 🔷 Wiki Documentation: `wiki`

**Trigger**: Include the word `wiki` in your request

**Function**: Generates or updates comprehensive project documentation in `docs/wiki/`

**Process**:

1. **Complete Project Analysis**
   - Scan ALL source code files in `src/`, `test/`, and configuration files
   - Analyze project structure, architecture, and dependencies
   - Identify all features, modules, API endpoints, and functionality
   - Extract database schemas, authentication flow, and integrations
   - Review package.json, configuration files, and build setup

2. **Existing Documentation Assessment**
   - Read all current wiki files in `docs/wiki/`
   - Compare documentation with actual implementation
   - Identify gaps, outdated information, and missing content
   - Determine what needs creation, updates, or removal

3. **Comprehensive Documentation Generation**
   - Create/update GitHub Wiki compatible files:
     - `Home.md` - Wiki homepage with project overview and navigation
     - `Getting-Started.md` - Setup, installation, and quick start guide
     - `API-Reference.md` - Complete API documentation with examples
     - `Authentication.md` - Auth system details and implementation
     - `Database.md` - Schema, models, and database operations
     - `Testing.md` - Testing strategy, examples, and procedures
     - `Deployment.md` - Deployment guides and CI/CD pipeline
     - `Configuration.md` - Environment setup and configuration
     - `Development-Workflow.md` - Development workflow and standards
     - `Security.md` - Security implementation and best practices
     - `Performance.md` - Performance considerations and optimization
     - `Troubleshooting.md` - Common issues and solutions
     - `Architecture.md` - System architecture and design patterns
     - `Contributing.md` - Contribution guidelines and standards
     - `_Sidebar.md` - Wiki navigation sidebar

4. **Quality Assurance**
   - Ensure all code examples are functional and tested
   - Verify all instructions are accurate and complete
   - Validate cross-references and links between topics
   - Maintain consistent formatting and technical English
   - Include practical examples and detailed explanations

**Usage Example**:

```
"Please update the wiki documentation for the authentication module"
"Generate wiki documentation for the new user management features"
"I need the wiki updated to reflect the latest database changes"
```

### 🔶 README Summary: `readme`

**Trigger**: Include the word `readme` in your request

**Function**: Generates executive summary based on complete wiki documentation

**Process**:

1. **Wiki Content Analysis**
   - Read ALL wiki documentation files
   - Extract key features, capabilities, and information
   - Identify essential setup and usage information
   - Gather project highlights and main functionality

2. **Executive Summary Generation**
   - Create comprehensive but concise project overview
   - Include essential setup and quick start instructions
   - List main features and capabilities clearly
   - Provide direct links to detailed wiki documentation
   - Maintain professional, accessible language
   - Structure for both technical and non-technical audiences

3. **Content Structure**
   - Project description and purpose
   - Key features and capabilities
   - Quick start guide
   - Technology stack overview
   - Links to detailed documentation
   - Contributing and support information

**Usage Example**:

```
"Generate a readme summary from the current wiki documentation"
"Update the project README based on the latest wiki content"
"Create an executive summary readme for stakeholders"
```

## Documentation Standards

### Content Quality Requirements

- **Accuracy**: Documentation MUST reflect actual implementation
- **Completeness**: Cover ALL major features and functionality
- **Clarity**: Use clear, technical English throughout
- **Examples**: Include practical, working code examples
- **Structure**: Maintain logical organization with clear headings
- **Currency**: Ensure documentation reflects current project state

### Technical Requirements

- **Language**: Technical English only (Rule 4 compliance)
- **Format**: GitHub Wiki compatible Markdown with consistent styling
- **Naming Convention**: Pascal-Case file names (e.g., `Getting-Started.md`)
- **Navigation**: Include `_Sidebar.md` for wiki navigation structure
- **Homepage**: Use `Home.md` as main entry point with project overview
- **Cross-Linking**: Use GitHub Wiki format `[[Page-Name]]` for internal links
- **Code Examples**: Functional, tested snippets with proper syntax highlighting
- **Visual Elements**: Use emojis and formatting for better readability
- **Timestamps**: Include last updated information in footer

### Wiki File Structure

Each wiki file should follow GitHub Wiki standards:

````markdown
# 📝 Topic Title

> Brief description of the topic with key value proposition

## 📊 Table of Contents

- [Overview](#overview)
- [Main Section](#main-section)
- [Code Examples](#code-examples)
- [Related Topics](#related-topics)

## 🔍 Overview

[Concise summary with bullet points]

## 💻 Main Content Sections

### Subsection with Examples

<details>
<summary>Click to expand detailed information</summary>

[Detailed content here]

</details>

## 📝 Code Examples

```typescript
// Functional, tested code examples
// with clear comments and explanations
```
````

## 🔗 Related Topics

- [[Getting-Started]] - Setup and installation
- [[API-Reference]] - API documentation
- [[Configuration]] - Environment setup

---

**Navigation**: [[Previous-Topic]] | [[Home]] | [[Next-Topic]]  
**Last Updated**: [Date] | **Version**: [Project Version]  
**Contributors**: [Contributor info]

```

## Integration Guidelines

### Project Analysis Scope

When generating documentation, analyze:

- **Source Code**: All TypeScript files in `src/`
- **Tests**: Unit and E2E tests in `test/`
- **Configuration**: Package.json, tsconfig, environment files
- **Database**: Prisma schema, migrations, and models
- **API**: Controllers, services, DTOs, and endpoints
- **Authentication**: Guards, strategies, and security implementation
- **Build System**: Scripts, CI/CD, and deployment configuration

### Documentation Organization

- **Wiki Location**: `docs/wiki/` (detailed documentation)
- **README Location**: Root `README.md` (executive summary)
- **API Docs**: Auto-generated Swagger documentation
- **Code Docs**: Inline JSDoc comments in source code

### Success Criteria

### Wiki Documentation Success

- ✅ Complete coverage of all project features
- ✅ Accurate reflection of current implementation
- ✅ Working code examples and instructions
- ✅ Clear, professional technical writing
- ✅ Logical organization and cross-referencing

### README Summary Success

- ✅ Clear, concise project overview
- ✅ Essential information for quick understanding
- ✅ Proper links to detailed documentation
- ✅ Accessible to both technical and non-technical audiences
- ✅ Current and accurate project representation

---

**Remember**: Documentation generation is triggered ONLY by explicit `wiki` or `readme` references in user requests. The system will not automatically generate or update documentation without these specific triggers.
```
