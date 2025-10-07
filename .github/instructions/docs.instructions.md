---
applyTo: '**'
---

# Documentation System Instructions

This document defines the comprehensive documentation system for PROJECT-A1-API, including wiki generation, README management, and documentation maintenance protocols.

## Overview

The documentation system is designed to:

- Automatically generate comprehensive project documentation
- Maintain up-to-date wiki-style documentation in `docs/wiki/`
- Create structured, topic-based documentation files
- Generate executive summaries in README format
- Ensure documentation reflects current project state

## Documentation Architecture

### Wiki Structure (`docs/wiki/`)

The wiki documentation is organized in GitHub Wiki compatible format:

```
docs/wiki/
├── Home.md                     # Wiki homepage (overview and navigation)
├── Getting-Started.md          # Setup and installation guide
├── API-Reference.md            # Complete API documentation
├── Authentication.md           # Authentication system details
├── Database.md                 # Database schema and operations
├── Testing.md                  # Testing strategy and examples
├── Deployment.md               # Deployment and CI/CD
├── Configuration.md            # Environment and configuration
├── Development-Workflow.md     # Development workflow and tools
├── Security.md                 # Security implementation
├── Performance.md              # Performance considerations
├── Troubleshooting.md          # Common issues and solutions
├── Architecture.md             # System architecture and design
├── Contributing.md             # Contribution guidelines
└── _Sidebar.md                 # Wiki navigation sidebar
```

### Documentation Types

1. **Wiki Documentation**: Comprehensive, detailed documentation organized by topic
2. **README Summary**: Executive overview generated from wiki content
3. **Code Documentation**: Inline comments and JSDoc in source code
4. **API Documentation**: Swagger/OpenAPI generated documentation

## Prompt-Based Documentation System

### Wiki Generation Trigger: `wiki`

When the reference `wiki` is used in a request:

1. **Full Project Analysis**:
   - Scan all source code files (`src/`, `test/`, configuration files)
   - Analyze project structure, dependencies, and architecture
   - Identify key features, modules, and functionality
   - Extract API endpoints, database schemas, and integrations

2. **Existing Documentation Assessment**:
   - Read all existing wiki files in `docs/wiki/`
   - Compare current documentation with actual implementation
   - Identify outdated, missing, or incorrect information
   - Determine what needs to be added, updated, or removed

3. **Documentation Generation/Update**:
   - Create or update topic-based wiki files
   - Include comprehensive examples and code snippets
   - Provide detailed explanations of implementation
   - Cross-reference between related topics
   - Maintain consistent formatting and structure

### README Generation Trigger: `readme`

When the reference `readme` is used in a request:

1. **Wiki Content Analysis**:
   - Read all wiki documentation files
   - Extract key points and essential information
   - Identify main features and capabilities
   - Gather quick start information

2. **Executive Summary Generation**:
   - Create concise project overview
   - Include essential setup instructions
   - List main features and capabilities
   - Provide links to detailed wiki documentation
   - Maintain professional, clear language

## Documentation Quality Standards

### Content Requirements

- **Accuracy**: Documentation must reflect actual implementation
- **Completeness**: Cover all major features and functionality
- **Clarity**: Use clear, technical English throughout
- **Examples**: Include practical code examples and usage scenarios
- **Structure**: Maintain consistent organization and formatting
- **Currency**: Keep documentation up-to-date with code changes

### Technical Standards

- **Language**: Technical English only (Rule 4 compliance)
- **Format**: GitHub Wiki compatible Markdown with consistent styling
- **Naming**: Use Pascal-Case for file names (e.g., `Getting-Started.md`)
- **Navigation**: Include `_Sidebar.md` for wiki navigation
- **Homepage**: Use `Home.md` as the main wiki entry point
- **Code Examples**: Functional, tested code snippets with syntax highlighting
- **Links**: Cross-references using GitHub Wiki link format `[[Page-Name]]`
- **Structure**: Logical organization with clear headings and TOC

### Wiki File Standards

Each wiki file should include:

1. **Header**: Title with emoji and brief description
2. **Table of Contents**: Auto-generated TOC for navigation
3. **Overview**: Summary of the topic with key points
4. **Detailed Sections**: In-depth coverage with subheadings
5. **Code Examples**: Syntax-highlighted, functional examples
6. **Navigation**: Links to related pages using `[[Page-Name]]` format
7. **Footer**: Navigation to previous/next topics
8. **Metadata**: Last updated timestamp and version info

#### GitHub Wiki Format Requirements:

- Use **Pascal-Case** for file names (e.g., `API-Reference.md`)
- Include **emoji indicators** in headers for visual hierarchy
- Use **collapsible sections** for detailed content
- Implement **consistent cross-linking** between wiki pages
- Maintain **sidebar navigation** in `_Sidebar.md`

## Documentation Organization and Navigation

### Sidebar Navigation (`_Sidebar.md`)

The `_Sidebar.md` file provides structured navigation for the wiki:

```markdown
## 📚 PROJECT-A1-API Wiki

### 🚀 Getting Started

- [[Home]]
- [[Getting-Started]]
- [[Configuration]]

### 🏗️ Architecture

- [[Architecture]]
- [[API-Reference]]
- [[Database]]

### 🔐 Security & Auth

- [[Authentication]]
- [[Security]]

### 🛠️ Development

- [[Development-Workflow]]
- [[Testing]]
- [[Performance]]

### 🚀 Deployment

- [[Deployment]]
- [[Troubleshooting]]

### 🤝 Contributing

- [[Contributing]]
```

### Homepage Structure (`Home.md`)

The `Home.md` serves as the main entry point:

- Project overview and mission
- Quick navigation to key topics
- Technology stack summary
- Recent updates and changelog links
- Getting started quick links

### Integration with Project Rules

This documentation system integrates with:

- **Rule 4**: Language standardization (technical English)
- **Rule 6**: Documentation standards
- **Rule 13**: Documentation organization
- **Commit Guidelines**: Documentation change tracking
- **Branch Strategy**: Documentation update workflow

The system ensures that documentation remains a valuable, accurate, and current resource for all project stakeholders.
