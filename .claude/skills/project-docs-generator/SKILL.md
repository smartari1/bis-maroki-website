---
name: project-docs-generator
description: Generate comprehensive Claude.md documentation files for code projects. Use when users want to create Claude.md files for Claude Code, need to document project architecture and tech stack for AI assistance, or are setting up new/existing projects (single or multi-repo) with proper documentation. Handles frontend, backend, full-stack, and microservice architectures.
license: Apache License 2.0. Complete terms in LICENSE.txt
---

# Project Documentation Generator

## Overview

This skill guides the creation of comprehensive Claude.md files for code projects. Claude.md files serve as onboarding documents for Claude Code, providing context about project architecture, tech stack, conventions, and common tasks.

The skill handles:
- Single repository projects
- Multi-repository systems (creates parent + child Claude.md files)
- New projects (planned architecture)
- Existing projects (current state documentation)
- All tech stacks (frontend, backend, full-stack, microservices)

## Workflow

Follow this sequential process:

### 1. Understand Requirements & Load References

**First, determine the scope by asking:**
1. "Is this a new project you're planning or an existing project?"
2. "Is this a single repository or multiple repositories?"

**Then load the appropriate reference file:**
- For all projects: Read [references/questioning-framework.md](references/questioning-framework.md) to guide information gathering
- For guidance on what makes a good Claude.md: Read [references/best-practices.md](references/best-practices.md)
- For inspiration and examples: Reference [references/examples.md](references/examples.md)

### 2. Gather Information Systematically

Follow the questioning framework from `references/questioning-framework.md` to gather:

**Phase 1: Project Type & Scope**
- New vs. existing project
- Single vs. multi-repo

**Phase 2: Multi-Repo Deep Dive** (if applicable)
- Number of repositories
- Purpose and type of each repo
- Repository relationships and dependencies
- Communication patterns
- Development and deployment workflow

**Phase 3: Tech Stack Details**
- Frontend framework, version, key libraries
- Backend language, framework, version
- Database type, version, ORM
- Infrastructure and deployment setup

**Phase 4: Architecture & Organization**
For new projects: Planned architecture and design patterns
For existing projects: Current architecture, pain points, technical debt, undocumented patterns

**Phase 5: Development Guidelines**
- Code style, linters, formatters
- Testing framework and approach
- Version control workflow
- File/folder naming conventions

**Phase 6: Common Operations**
- Setup steps and prerequisites
- How to run locally
- Testing commands
- Deployment process
- Common development tasks

**Phase 7: Project-Specific Context**
- Business context and users
- External integrations
- Known issues and workarounds

**Adaptive Questioning:**
- Don't overwhelm with too many questions at once
- Break down complex questions into simpler parts
- Provide examples when users seem unsure
- Skip obvious questions if user is very technical
- Probe for specifics when answers are vague

**Validation Before Generation:**
Before generating Claude.md files, confirm you have:
- [ ] Complete tech stack information
- [ ] Clear architecture understanding
- [ ] Development workflow details
- [ ] Common tasks documented
- [ ] Multi-repo relationships mapped (if applicable)

### 3. Choose Appropriate Template(s)

Select template based on project structure:

**Single Repository:**
- Use `assets/claude-md-template-single.md`
- Creates one comprehensive Claude.md file

**Multiple Repositories:**
- Use `assets/claude-md-template-multi-parent.md` for system overview
- Use `assets/claude-md-template-multi-child.md` for each individual repo
- Parent file links to all child files
- Each child file links back to parent

### 4. Generate Claude.md File(s)

**For Single Repository:**
1. Copy template: `assets/claude-md-template-single.md`
2. Replace all `{{PLACEHOLDER}}` variables with gathered information
3. Remove any sections not applicable to this project
4. Add project-specific details beyond template structure
5. Follow best practices from `references/best-practices.md`
6. Create file as `CLAUDE.md` in `/mnt/user-data/outputs/`

**For Multiple Repositories:**

First, create parent system overview:
1. Copy template: `assets/claude-md-template-multi-parent.md`
2. Fill in system-wide information
3. List all repositories with their purposes
4. Document repository relationships
5. Create as `CLAUDE.md` in `/mnt/user-data/outputs/`

Then, for each repository:
1. Copy template: `assets/claude-md-template-multi-child.md`
2. Fill in repo-specific information
3. Document integration points with other repos
4. Link back to parent documentation
5. Create as `{repo-name}/CLAUDE.md` in `/mnt/user-data/outputs/{repo-name}/`

### 5. Apply Best Practices

Ensure generated Claude.md files follow these principles from `references/best-practices.md`:

**Content Quality:**
- Be specific and contextual (not generic)
- Include project-specific patterns and conventions
- Document non-obvious decisions and workarounds
- Focus on actionable information
- Include versions for all technologies

**What to Include:**
- Actual directory structure with explanations
- Real commands and examples
- Known issues with solutions
- Project-specific testing approach
- Environment variables needed

**What NOT to Include:**
- Generic best practices
- Auto-generated documentation (link to it instead)
- Historical information no longer relevant
- Complete dependency lists (they're in package files)

**Writing Style:**
- Clear, concise language
- Present tense, active voice
- Bullet points for lists
- Code examples for non-obvious patterns
- Headers for easy scanning

### 6. Present Files to User

**For Single Repository:**
Present the Claude.md file with a brief explanation:
"I've created a comprehensive Claude.md file for your project. This includes [mention 2-3 key sections like architecture, tech stack, setup instructions]. The file documents [mention any particularly important aspects like known issues, multi-step workflows, etc.]."

**For Multiple Repositories:**
Present all files with clear structure:
"I've created a complete documentation set for your multi-repo system:

1. Main system documentation (CLAUDE.md) - Covers the overall architecture and how services interact
2. Individual repository documentation:
   - {repo-name}/CLAUDE.md - [brief description]
   - {repo-name}/CLAUDE.md - [brief description]
   
Each repository's Claude.md includes its specific setup, role in the system, and integration points."

**Always provide computer:// links to all files created.**

## Template Variable Reference

When filling templates, use this guide:

**Project Identification:**
- `{{PROJECT_NAME}}` - Official project name
- `{{PROJECT_DESCRIPTION}}` - 2-3 sentence description of purpose and users

**Tech Stack:**
- `{{FRONTEND_STACK}}` - Framework + version + key libraries (e.g., "Next.js 14.1, React 18, Tailwind CSS")
- `{{BACKEND_STACK}}` - Language + framework + version (e.g., "Node.js 20, Express 4.18")
- `{{DATABASE}}` - Type + version + ORM (e.g., "PostgreSQL 15, Prisma ORM")
- `{{INFRASTRUCTURE}}` - Deployment platform + tools (e.g., "AWS ECS, Docker, GitHub Actions")

**Architecture:**
- `{{ARCHITECTURE_DESCRIPTION}}` - High-level architecture explanation with specifics
- `{{KEY_COMPONENTS}}` - Main parts and their relationships
- `{{DIRECTORY_STRUCTURE}}` - Actual directory tree with explanations

**Development:**
- `{{CODE_CONVENTIONS}}` - Project-specific rules (not generic advice)
- `{{BEST_PRACTICES}}` - Team-specific practices
- `{{SETUP_INSTRUCTIONS}}` - Exact setup steps with commands
- `{{RUN_INSTRUCTIONS}}` - How to run locally with specific commands
- `{{TESTING_INSTRUCTIONS}}` - Testing framework + commands

**Project Specific:**
- `{{KEY_FILES}}` - Important files and why they matter
- `{{API_ROUTES}}` - Endpoints if applicable
- `{{ENV_VARIABLES}}` - Required environment variables
- `{{KNOWN_ISSUES}}` - Real current issues and workarounds

**Multi-Repo Specific:**
- `{{ARCHITECTURE_TYPE}}` - Microservices, monorepo, etc.
- `{{REPO_LIST}}` - All repositories with purposes
- `{{REPO_DEPENDENCIES}}` - How repos relate and depend on each other
- `{{CROSS_REPO_COMMUNICATION}}` - How services communicate
- `{{REPO_ROLE}}` - This specific repo's purpose
- `{{APIS_EXPOSED}}` - What this repo provides to others
- `{{APIS_CONSUMED}}` - What this repo uses from others

## Key Principles

**Progressive Disclosure:**
For complex projects, create focused documentation rather than overwhelming single files. Multi-repo systems naturally split into parent + child docs.

**Current State Over Aspirational:**
For existing projects, document what IS, not what should be. Include technical debt and known issues.

**Specificity Over Generality:**
"Run tests with `npm test:watch`" beats "Run tests using npm commands"
"Using Zustand for cart state only" beats "Using state management"

**Context for AI:**
Remember: Claude Code will read this file. Include information that helps an AI understand the project, like why certain patterns exist, what gotchas to watch for, and where to find key logic.

## Examples

See `references/examples.md` for:
- Complete example of single-repo e-commerce frontend
- Complete example of multi-repo microservices system
- Examples of good vs. poor documentation
- Side-by-side comparisons showing what makes documentation effective

## Troubleshooting

**User provides minimal information:**
- Use examples: "Are you using something like React, Vue, or Angular?"
- Break down questions: "Let's start with the backend - what language?"
- Reference examples from `references/examples.md`

**Unclear about multi-repo structure:**
- Ask specifically: "How many repositories are there?"
- Draw out relationships: "Does the frontend call the backend API directly?"
- Reference multi-repo examples

**New project with planned architecture:**
- Focus on intentions: "What architecture are you planning?"
- Ask about decisions: "Why did you choose [technology]?"
- Document as planned state, not as if it exists

**Existing project with pain points:**
- Ask about struggles: "What do new developers find confusing?"
- Document workarounds: "Are there any patterns you'd like documented?"
- Include technical debt: "Any known issues that should be documented?"
