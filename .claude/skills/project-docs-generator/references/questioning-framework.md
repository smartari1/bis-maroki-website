# Information Gathering Framework

## Questioning Strategy

Follow this structured approach to gather complete project information efficiently.

## Phase 1: Project Type & Scope (ALWAYS START HERE)

**Primary Questions:**
1. "Is this a new project or an existing project?"
2. "Is this a single repository or multiple repositories?"

**Follow-up based on answers:**
- **If new + single repo**: Focus on planned architecture and tech decisions
- **If new + multi-repo**: Understand planned repo structure and integration
- **If existing + single repo**: Focus on current state and pain points
- **If existing + multi-repo**: Map out repo relationships and current architecture

## Phase 2: Multi-Repo Deep Dive (IF MULTI-REPO)

**Core Questions:**
1. "How many repositories are there?"
2. "What is the purpose/role of each repository?"
3. "What type of architecture is this?" (microservices, monorepo, frontend/backend split, etc.)

**Relationship Questions:**
4. "How do the repositories communicate with each other?"
5. "Are there any shared dependencies or libraries?"
6. "Which repos depend on which other repos?"

**Development Workflow:**
7. "How do developers work across multiple repos locally?"
8. "How are the repos deployed?" (independently, together, orchestrated)

**Decision Point:** Create parent Claude.md + individual Claude.md for each repo

## Phase 3: Tech Stack Details

**Frontend (if applicable):**
1. "What frontend framework/library are you using?" (React, Vue, Angular, etc.)
2. "What version?"
3. "Any meta-framework?" (Next.js, Nuxt, etc.)
4. "Key frontend libraries?" (state management, UI libraries, etc.)

**Backend (if applicable):**
1. "What backend language/runtime?" (Node.js, Python, Go, etc.)
2. "What framework?" (Express, FastAPI, Django, etc.)
3. "What version?"
4. "Key backend libraries or patterns?"

**Database:**
1. "What database(s) are you using?" (PostgreSQL, MongoDB, etc.)
2. "Are you using an ORM/query builder?" (Prisma, TypeORM, SQLAlchemy, etc.)
3. "Database version?"

**Infrastructure:**
1. "Where is this deployed?" (AWS, GCP, Azure, Vercel, self-hosted, etc.)
2. "Any containerization?" (Docker, Kubernetes, etc.)
3. "CI/CD setup?" (GitHub Actions, GitLab CI, Jenkins, etc.)

## Phase 4: Architecture & Organization

### For New Projects:
**Planning Questions:**
1. "What architecture pattern are you planning?" (monolithic, microservices, serverless, etc.)
2. "How are you planning to organize the code?" (feature-based, layer-based, domain-driven, etc.)
3. "Any specific design patterns you're planning to use?"
4. "What are your main technical goals or requirements?"

### For Existing Projects:
**Current State Questions:**
1. "Can you describe the current architecture?"
2. "How is the codebase organized?" (directory structure approach)
3. "What are the main components/modules?"
4. "Are there any architectural patterns or principles being followed?"

**Pain Point Questions:**
5. "What are the current challenges or pain points?"
6. "Is there any technical debt you want documented?"
7. "Any non-obvious patterns or workarounds?"
8. "What do new developers struggle with most?"

## Phase 5: Development Guidelines

**Code Style:**
1. "Do you have code style guidelines or linters?" (ESLint, Prettier, Black, etc.)
2. "Any naming conventions?"
3. "File/folder naming patterns?"

**Testing:**
1. "What testing framework(s) are you using?"
2. "What types of tests?" (unit, integration, e2e)
3. "Test coverage requirements?"
4. "Where are tests located?"

**Version Control:**
1. "Git workflow?" (GitFlow, trunk-based, feature branches)
2. "Branch naming conventions?"
3. "Commit message conventions?"
4. "PR requirements?"

## Phase 6: Common Operations

**Setup & Running:**
1. "What are the setup steps?" (installation, config, etc.)
2. "How do you run the project locally?"
3. "Any environment variables needed?"
4. "Any local services required?" (databases, Redis, etc.)

**Development Tasks:**
1. "Common development tasks?" (database migrations, code generation, etc.)
2. "Build process?"
3. "How to run tests?"
4. "Debugging setup?"

**Deployment:**
1. "How is the project deployed?"
2. "Deployment environments?" (dev, staging, production)
3. "Any deployment scripts or commands?"

## Phase 7: Project-Specific Context

**Business Context:**
1. "What problem does this project solve?"
2. "Who are the users?"
3. "Any business logic quirks to document?"

**Integration Points:**
1. "Any external APIs or services?"
2. "Authentication approach?"
3. "Third-party integrations?"

**Documentation & Resources:**
1. "Is there existing documentation?" (where?)
2. "Design documents or RFCs?"
3. "Are there related projects or repositories?"

## Adaptive Questioning

**If user seems unsure:**
- Offer examples: "For example, if you're using React, are you using Next.js or Create React App?"
- Break down complex questions: "Let's start with the frontend - what are you using there?"

**If user gives minimal info:**
- Ask for specifics: "Can you tell me more about [topic]?"
- Probe for context: "Why did you choose [technology]?"

**If user is very technical:**
- Skip basic explanations
- Focus on architectural decisions and patterns
- Ask about trade-offs and design choices

**If user is less technical:**
- Explain terms as needed
- Focus on practical workflows
- Keep questions concrete

## Validation

Before generating Claude.md files, confirm:
- [ ] All tech stack components identified
- [ ] Architecture understood (or planned architecture for new projects)
- [ ] Development workflow clear
- [ ] Common tasks documented
- [ ] Pain points noted (for existing projects)
- [ ] Multi-repo relationships mapped (if applicable)
- [ ] Integration points understood

## Red Flags - Need More Info

⚠️ Vague tech stack ("modern stack", "standard setup")
⚠️ No architecture description
⚠️ Unknown about multi-repo structure
⚠️ No development workflow information
⚠️ Missing deployment information
⚠️ No testing information

When you hit these, dig deeper with specific questions.
