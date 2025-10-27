# Claude.md Best Practices & Guidelines

## Purpose of Claude.md

A Claude.md file serves as an onboarding document for Claude Code, enabling it to understand a project's context, architecture, conventions, and common tasks. Think of it as documentation written specifically for an AI coding assistant.

## Key Principles

### 1. Be Specific and Contextual
- Explain the "why" behind architectural decisions
- Include context that isn't obvious from code alone
- Document tribal knowledge and team conventions
- Explain non-standard patterns or workarounds

### 2. Focus on Actionable Information
- Prioritize information that helps with coding tasks
- Include common commands and workflows
- Document frequent pain points and solutions
- List key files and their purposes

### 3. Keep it Current
- Update when architecture changes
- Reflect actual current state, not aspirational
- Remove outdated information promptly
- Version control the Claude.md file

## What to Include

### Essential Sections

**Project Overview**
- Clear description of what the project does
- Target users/customers
- Business context if relevant
- Tech stack summary

**Architecture**
- High-level architecture diagram (as ASCII or description)
- Key components and their relationships
- Data flow patterns
- Design patterns used

**Directory Structure**
- Key directories and their purposes
- Where to find different types of files
- Organizational conventions

**Development Guidelines**
- Code style and formatting rules
- Naming conventions
- Testing requirements
- PR/commit conventions

**Common Tasks**
- How to set up the project
- How to run locally
- How to test
- How to deploy
- Common debugging procedures

**Key Files**
- Configuration files and their purpose
- Entry points
- Important modules
- Where business logic lives

### Valuable Optional Sections

**API Documentation**
- Endpoints and their purposes
- Authentication patterns
- Common request/response examples

**Database Schema**
- Key tables and relationships
- Migration strategy
- ORM patterns used

**Dependencies & Integrations**
- Third-party services
- API keys and secrets management
- External dependencies

**Known Issues & Gotchas**
- Common pitfalls
- Workarounds for known bugs
- Platform-specific issues
- Performance considerations

**Troubleshooting**
- Common errors and solutions
- Debug strategies
- Where to find logs

## What NOT to Include

❌ Auto-generated API documentation (link to it instead)
❌ Complete dependency lists (they're in package.json/requirements.txt)
❌ Code examples that duplicate existing code
❌ Overly detailed explanations of standard frameworks
❌ Historical information that's no longer relevant
❌ Generic best practices (focus on project-specific ones)

## Writing Style

### Do:
- Use clear, concise language
- Write in present tense
- Use active voice
- Include code examples for non-obvious patterns
- Use bullet points for lists
- Use headers for easy scanning

### Don't:
- Write long paragraphs
- Use marketing language
- Include unnecessary jargon
- Make assumptions about knowledge
- Write tutorial-style documentation (unless project-specific)

## Multi-Repository Considerations

### Parent Repository Claude.md
- System-wide overview
- How repositories relate to each other
- Cross-repo dependencies
- Deployment orchestration
- Development workflow across repos

### Individual Repository Claude.md
- Repo-specific details
- This repo's role in the system
- Integration points with other repos
- Repo-specific setup and commands
- Link back to parent documentation

## Gathering Information Checklist

### New Projects
- [ ] Project purpose and goals
- [ ] Target users
- [ ] Tech stack choices and why
- [ ] Planned architecture
- [ ] Development conventions
- [ ] Deployment strategy

### Existing Projects
- [ ] Current architecture (not planned)
- [ ] Recent changes or migrations
- [ ] Known technical debt
- [ ] Current pain points
- [ ] Onboarding friction points
- [ ] Undocumented conventions
- [ ] Team-specific practices

### Multi-Repo Systems
- [ ] How many repositories
- [ ] Purpose of each repository
- [ ] Dependencies between repos
- [ ] Shared infrastructure
- [ ] Development workflow
- [ ] Deployment coordination
- [ ] Where shared code lives

## Examples of Good vs. Poor Documentation

### ❌ Poor: Vague and Unhelpful
```
## Architecture
The project uses a modern architecture with best practices.
```

### ✅ Good: Specific and Actionable
```
## Architecture
Three-tier architecture with Next.js frontend, Express.js API, and PostgreSQL.

- Frontend: /app directory uses Next.js 14 App Router
- API: /api directory uses Express with TypeScript
- Database: PostgreSQL 15, accessed via Prisma ORM

Key pattern: API routes in /api/routes follow RESTful conventions.
Data flows: Frontend → Next.js API routes → Express backend → PostgreSQL
```

### ❌ Poor: Generic Information
```
## Testing
Write tests for your code.
```

### ✅ Good: Project-Specific Guidance
```
## Testing
- Unit tests: Jest (*.test.ts files next to source)
- Integration tests: /tests/integration using Supertest
- E2E tests: Playwright in /e2e
- Run: `npm test` (watch mode) or `npm run test:ci` (single run)
- Coverage requirement: 80% minimum for /src/core

Note: Mock external APIs using MSW. Config in /tests/mocks/handlers.ts
```

## Template Variables Guide

When using templates, fill these sections thoughtfully:

**{{PROJECT_NAME}}**: Official project name

**{{PROJECT_DESCRIPTION}}**: 2-3 sentences on what it does and why

**{{FRONTEND_STACK}}**: Framework, version, key libraries

**{{BACKEND_STACK}}**: Framework, runtime version, key patterns

**{{DATABASE}}**: Type, version, ORM if applicable

**{{ARCHITECTURE_DESCRIPTION}}**: High-level architecture, not just buzzwords

**{{CODE_CONVENTIONS}}**: Project-specific rules, not generic advice

**{{KNOWN_ISSUES}}**: Real current issues, not hypothetical

**{{DIRECTORY_STRUCTURE}}**: Actual directory tree with explanations
