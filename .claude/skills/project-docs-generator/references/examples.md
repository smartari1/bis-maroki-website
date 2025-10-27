# Claude.md Examples

## Example 1: E-commerce Frontend (Single Repo, Existing Project)

### ✅ Good Claude.md

```markdown
# ShopFlow - E-commerce Platform Frontend

## Project Overview
ShopFlow is a Next.js-based e-commerce storefront for fashion retail. It connects to our backend API and handles product browsing, cart management, and checkout.

**Target Users:** B2C fashion shoppers
**Production:** https://shopflow.example.com

**Tech Stack:**
- **Frontend:** Next.js 14.1.0 (App Router)
- **Styling:** Tailwind CSS 3.4
- **State:** Zustand for cart, React Query for server state
- **API Client:** Axios with custom interceptors
- **Forms:** React Hook Form + Zod validation

## Architecture

Next.js App Router architecture with route groups:

```
/app
  /(shop)           # Main shopping experience
    /products
    /cart
    /checkout
  /(account)        # User account pages
    /profile
    /orders
  /api              # API routes (proxy to backend)
```

**Key Pattern:** Server Components by default, Client Components only when needed for interactivity.

**Data Flow:** 
1. Server Components fetch initial data via API routes
2. Client Components use React Query for mutations and dynamic data
3. Zustand manages cart state (persisted to localStorage)

## Development Guidelines

### Code Conventions
- Component files: PascalCase (e.g., `ProductCard.tsx`)
- Utility files: camelCase (e.g., `formatPrice.ts`)
- Use TypeScript strict mode
- Prefer named exports over default exports
- Co-locate tests: `ComponentName.test.tsx`

### State Management Rules
- Use Server Components for initial data loads
- Use React Query for server state (products, orders, user data)
- Use Zustand only for cart state
- No Redux (legacy code being migrated)

### API Communication
- All API calls go through `/app/api` routes (never direct from client)
- API routes use `apiClient.ts` which handles auth tokens
- Error handling: Use `ApiError` class for consistent error messages

## Setup & Running

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation
```bash
pnpm install
cp .env.example .env.local  # Then fill in API_URL and STRIPE_KEY
```

### Running Locally
```bash
pnpm dev          # Runs on localhost:3000
pnpm dev:mock     # Runs with mock API (no backend needed)
```

### Testing
```bash
pnpm test              # Jest unit tests
pnpm test:e2e          # Playwright E2E tests
pnpm test:e2e:debug    # E2E with UI
```

## Key Files

- `/app/api/client.ts` - API client with auth interceptors
- `/lib/cart.ts` - Cart Zustand store (critical business logic)
- `/lib/constants.ts` - Shipping costs, tax rates, business rules
- `/components/ui/*` - Shared UI components (shadcn/ui based)
- `/hooks/useCheckout.ts` - Complex checkout logic (read this before modifying checkout)

## API Integration

**Backend API:** https://api.shopflow.example.com
**Authentication:** JWT tokens in HttpOnly cookies (set by `/api/auth` routes)

### Key Endpoints (via API routes)
- `GET /api/products` - Product catalog
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Order details
- `POST /api/checkout` - Initiate Stripe checkout

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=      # Backend API URL
NEXT_PUBLIC_STRIPE_KEY=    # Stripe publishable key
API_SECRET_KEY=            # Backend API secret (server-side only)
```

## Known Issues & Gotchas

1. **Image Optimization:** Product images must be served from `images.shopflow.example.com` or added to `next.config.js` `remotePatterns`. Adding new domains requires rebuild.

2. **Cart Persistence:** Cart state is localStorage-only. Lost on device switch. Backend cart sync is in backlog.

3. **Stale Product Data:** React Query cache is 5 minutes. If products update, users may see old prices. Workaround: Add `revalidate` button on product pages.

4. **Stripe Checkout:** Must run on HTTPS for Stripe to work (use ngrok for local development with real payments).

## Common Tasks

### Adding a New Product Page Section
1. Create component in `/components/product/`
2. Add to `/app/(shop)/products/[slug]/page.tsx`
3. Add tests in `/components/product/__tests__/`

### Updating Checkout Flow
⚠️ Checkout is complex. Read `/hooks/useCheckout.ts` first.
1. Modify `useCheckout.ts` hook
2. Update `/app/(shop)/checkout/page.tsx`
3. Test with `pnpm test:e2e -- checkout.spec.ts`

### Adding New API Route
1. Create in `/app/api/[route]/route.ts`
2. Use `apiClient` from `/app/api/client.ts`
3. Add error handling with `ApiError`
4. Add OpenAPI docs in `/docs/api.yaml`

## Troubleshooting

**"API_URL is not defined"**: Check `.env.local` exists and has `NEXT_PUBLIC_API_URL`

**Build fails with "Module not found"**: Clear `.next` folder and `node_modules`, reinstall

**Cart items disappear**: Check localStorage isn't disabled. Cart sync with backend is not implemented yet.

**Stripe checkout fails**: Ensure running on HTTPS (use ngrok locally) and `NEXT_PUBLIC_STRIPE_KEY` is set
```

### ❌ Poor Version of Same Project

```markdown
# ShopFlow

## About
This is our e-commerce website.

## Tech Stack
- Next.js
- React
- Tailwind

## Getting Started
Install dependencies and run the project.

## Code Style
Follow best practices.

## Architecture
We use a modern architecture with components.
```

**Why it's poor:**
- No specific versions
- No actual directory structure
- Vague "best practices" without project-specific rules
- No pain points or gotchas documented
- No API information
- No environment variables
- Generic information that doesn't help Claude Code

---

## Example 2: Microservices (Multi-Repo, Existing)

### ✅ Good Parent Claude.md

```markdown
# PaymentFlow - Payment Processing Platform

## System Overview
PaymentFlow is a microservices-based payment processing system handling transactions for multiple e-commerce clients. Built for high availability and PCI compliance.

**Architecture Type:** Microservices with event-driven communication

**Scale:** 10K+ transactions/minute, 99.9% uptime SLA

## Repository Structure

### Core Services
1. **payment-api** - Main API gateway (Node.js/Express)
2. **payment-processor** - Payment processing engine (Go)
3. **fraud-detection** - ML-based fraud detection (Python/FastAPI)
4. **notification-service** - Email/SMS notifications (Node.js)

### Support Repositories
5. **payment-sdk** - Client SDKs (TypeScript/Python)
6. **shared-schemas** - Protobuf schemas for service communication
7. **infrastructure** - Terraform configs and deployment scripts

### Internal Tools
8. **admin-dashboard** - Internal ops dashboard (React/Next.js)

## Inter-Service Dependencies

```
payment-api → payment-processor → fraud-detection
            ↓                    ↓
      notification-service ←────┘
```

**Message Bus:** RabbitMQ for async events
**Service Discovery:** Consul
**Config:** Consul KV store

## Development Workflow

### Local Development Setup
1. Clone all repos into same parent directory
2. Run `./scripts/setup-local.sh` from infrastructure repo
3. This starts: PostgreSQL, RabbitMQ, Consul via Docker Compose
4. Each service runs independently (see individual repo Claude.md files)

### Cross-Service Development
- Use `docker-compose.dev.yaml` to run all services locally
- Or run specific service locally + others in Docker
- Mock external services: Use `./mocks/` in each repo

### Testing Strategy
- Unit tests: In each repo
- Integration tests: `/integration-tests` repo (separate)
- E2E tests: Run against staging environment

## Deployment Strategy

**Environments:** dev, staging, production
**CI/CD:** GitHub Actions + ArgoCD
**Deployment:** Kubernetes on AWS EKS

**Process:**
1. PR merged → GitHub Actions builds Docker image
2. Image pushed to ECR
3. ArgoCD auto-deploys to dev
4. Manual promotion to staging → production

**Zero-downtime:** Blue-green deployments for all services

## Shared Resources

**Database:** Each service has own PostgreSQL database (no shared DB)
**Message Queue:** Shared RabbitMQ cluster
**Secrets:** AWS Secrets Manager
**Logging:** CloudWatch + DataDog
**Monitoring:** DataDog APM

## Repository-Specific Details

- [payment-api/CLAUDE.md](./payment-api/CLAUDE.md) - API Gateway
- [payment-processor/CLAUDE.md](./payment-processor/CLAUDE.md) - Core processor
- [fraud-detection/CLAUDE.md](./fraud-detection/CLAUDE.md) - Fraud ML service
- [notification-service/CLAUDE.md](./notification-service/CLAUDE.md) - Notifications
- [payment-sdk/CLAUDE.md](./payment-sdk/CLAUDE.md) - Client SDKs
- [shared-schemas/CLAUDE.md](./shared-schemas/CLAUDE.md) - Protobuf schemas
- [infrastructure/CLAUDE.md](./infrastructure/CLAUDE.md) - IaC and deployment
- [admin-dashboard/CLAUDE.md](./admin-dashboard/CLAUDE.md) - Internal dashboard

## Getting Started

### For New Developers
1. Clone all repos
2. Read [ONBOARDING.md](./docs/ONBOARDING.md)
3. Run local setup: `cd infrastructure && ./scripts/setup-local.sh`
4. Start with payment-api repo (good entry point)
5. Join #paymentflow-dev on Slack

### For Quick Testing
```bash
# Start all services
cd infrastructure
docker-compose -f docker-compose.dev.yaml up

# Test API
curl -X POST localhost:3000/api/v1/payments \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "currency": "USD"}'
```

## Common Multi-Repo Tasks

### Updating Shared Schemas
1. Modify in `shared-schemas` repo
2. Bump version
3. Update version in consuming services
4. Test integration locally
5. Deploy in order: schemas → services

### Adding New Event Type
1. Define in `shared-schemas/events/`
2. Update RabbitMQ bindings in `infrastructure/messaging/`
3. Implement publisher in source service
4. Implement consumer in target service
5. Test with `integration-tests`

### Database Migration
- Each service manages its own migrations
- Never share databases between services
- Use `/migrations` directory in each service repo
- Apply with: `npm run migrate:up` (Node) or `alembic upgrade head` (Python)

## Troubleshooting

**Services can't communicate:**
- Check Consul is running: `consul members`
- Verify service registration: `consul catalog services`
- Check network: `docker network ls`

**RabbitMQ message loss:**
- Confirm message persistence in publisher
- Check queue configuration in `infrastructure/messaging/queues.yaml`
- View dead letter queue: RabbitMQ Management UI at localhost:15672

**Database connection errors:**
- Each service connects to different DB (check connection strings)
- Verify PostgreSQL running: `docker ps | grep postgres`
- Check credentials in AWS Secrets Manager (prod) or `.env.local` (local)

## Key Architectural Decisions

**Why microservices?** 
- Different services have different scaling needs (fraud detection is CPU-intensive)
- Team autonomy (separate teams own separate services)
- Technology diversity (Go for speed, Python for ML)

**Why separate databases?**
- Service independence
- Easier scaling
- Failure isolation

**Why RabbitMQ over Kafka?**
- Lower complexity for our scale
- Better developer experience
- Sufficient for 10K TPS
```

### ✅ Good Child Claude.md (payment-processor service)

```markdown
# payment-processor

## Repository Overview
Core payment processing engine. Handles payment execution, retry logic, and settlement. Written in Go for high performance.

**Part of:** PaymentFlow Multi-Service Platform
**Repository Type:** Core Microservice

**Tech Stack:**
- **Language:** Go 1.21
- **Framework:** Standard library + Chi router
- **Database:** PostgreSQL 15 + GORM
- **Message Queue:** RabbitMQ (amqp091-go)
- **Observability:** DataDog Go tracer

## This Service's Role

Receives payment requests from payment-api, processes them through payment gateways (Stripe, Square, PayPal), handles retries, and emits events on success/failure.

**Responsibilities:**
- Execute payments via gateway APIs
- Retry failed payments with exponential backoff
- Store transaction records
- Emit payment events to RabbitMQ
- Handle idempotency

**NOT responsible for:**
- Authentication (handled by payment-api)
- Fraud checks (fraud-detection service)
- Notifications (notification-service)

## Architecture

**Pattern:** Hexagonal architecture (ports & adapters)

```
/cmd/processor       - Main entry point
/internal
  /core              - Domain logic (payment processing)
  /adapters          - Gateway implementations
    /stripe
    /square  
    /paypal
  /ports             - Interfaces
  /messaging         - RabbitMQ pub/sub
  /repository        - Database layer
```

**Key Design:**
- Gateway implementations are swappable (adapter pattern)
- Core business logic is pure Go (no external dependencies)
- Repository pattern for database access

## Integration Points

### Dependencies on Other Services
- **shared-schemas** - Protobuf event definitions
- **fraud-detection** - Subscribes to our payment events, can reject

### APIs Exposed
None (internal service, called only by payment-api via RabbitMQ)

### APIs Consumed
- **Payment Gateways:** Stripe, Square, PayPal APIs
- **RabbitMQ:** Publishes to `payments.processed` exchange
- **Consul:** Service registration and health checks

### Events Published
- `payment.succeeded` - Payment successfully processed
- `payment.failed` - Payment failed (includes retry count)
- `payment.refunded` - Refund processed

### Events Consumed
- `payment.requested` - New payment to process (from payment-api)
- `fraud.rejected` - Fraud detection rejected payment

## Development Guidelines

### Code Style & Conventions
- Follow [Uber Go Style Guide](https://github.com/uber-go/guide/blob/master/style.md)
- Run `golangci-lint` before commit
- Package naming: lowercase, no underscores
- Interface naming: `er` suffix (e.g., `PaymentProcessor`)

### Best Practices
- Always use context.Context for cancellation
- Handle errors explicitly (no panic in production code)
- Use structured logging (logrus)
- Add DataDog traces to all external calls
- Write table-driven tests

## Setup & Development

### Prerequisites
- Go 1.21+
- Docker & Docker Compose (for local dependencies)
- PostgreSQL 15
- RabbitMQ

### Installation
```bash
# Install dependencies
go mod download

# Set up local database
docker-compose up -d postgres rabbitmq

# Run migrations
go run cmd/migrate/main.go up

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your values
```

### Running Locally
```bash
# With auto-reload
air

# Or standard
go run cmd/processor/main.go

# With debug logging
DEBUG=true go run cmd/processor/main.go
```

### Testing
```bash
# Unit tests
go test ./... -v

# With coverage
go test ./... -cover -coverprofile=coverage.out
go tool cover -html=coverage.out

# Integration tests (requires Docker)
go test ./tests/integration/... -tags=integration

# Benchmark
go test ./internal/core/... -bench=. -benchmem
```

## Key Files & Components

- **`cmd/processor/main.go`** - Entry point, wires up dependencies
- **`internal/core/processor.go`** - Main payment processing logic (critical)
- **`internal/adapters/`** - Payment gateway implementations
  - Each gateway has `gateway_name.go` and `gateway_name_test.go`
- **`internal/messaging/publisher.go`** - RabbitMQ event publishing
- **`internal/repository/transaction_repo.go`** - Transaction persistence
- **`pkg/retry/`** - Exponential backoff retry logic (used across gateways)

## Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/payments

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672/

# Payment Gateways
STRIPE_SECRET_KEY=sk_...
SQUARE_ACCESS_TOKEN=sq_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Service Config
PORT=8081
LOG_LEVEL=info  # debug, info, warn, error
MAX_RETRIES=3
RETRY_DELAY_MS=1000  # Initial retry delay

# Observability
DATADOG_AGENT_HOST=localhost:8126
DATADOG_SERVICE_NAME=payment-processor
```

## Build & Deployment

### Build Docker Image
```bash
docker build -t payment-processor:latest .
```

### Deployment
Deployed via ArgoCD (GitOps). See `../infrastructure/k8s/payment-processor/` for manifests.

**Deployment Order:** 
1. Run migrations (Kubernetes Job)
2. Deploy new version
3. Health check passes → old version terminated

## Common Tasks in This Repo

### Adding New Payment Gateway
1. Create adapter in `internal/adapters/newgateway/`
2. Implement `PaymentGateway` interface
3. Add configuration in `config/gateways.go`
4. Add tests with mocked HTTP responses
5. Update `internal/core/processor.go` to route to new gateway

### Modifying Retry Logic
- Edit `pkg/retry/exponential.go`
- ⚠️ Critical for reliability - test thoroughly
- Max retries is 3 by default (configurable via MAX_RETRIES env var)

### Adding New Event Type
1. Update protobuf in `../shared-schemas`
2. Run `make generate` to update Go code
3. Publish in `internal/messaging/publisher.go`
4. Update tests in `tests/integration/messaging_test.go`

### Database Migration
```bash
# Create new migration
migrate create -ext sql -dir migrations -seq description

# Apply migration
go run cmd/migrate/main.go up

# Rollback
go run cmd/migrate/main.go down
```

## Troubleshooting

**"Failed to connect to database"**
- Check DATABASE_URL in .env.local
- Verify PostgreSQL is running: `docker ps | grep postgres`
- Test connection: `psql $DATABASE_URL`

**"RabbitMQ connection refused"**
- Ensure RabbitMQ running: `docker-compose up rabbitmq`
- Check RABBITMQ_URL matches Docker network
- Verify queue exists: RabbitMQ Management UI (localhost:15672)

**"Gateway timeout" errors**
- Check payment gateway API keys are valid
- Verify network connectivity to gateway
- Check DataDog APM for trace details
- Gateway may be rate-limiting (check retry-after header)

**Payments stuck in "processing"**
- Check dead letter queue in RabbitMQ
- Review logs: `docker logs payment-processor`
- Verify gateway status pages
- Check idempotency keys aren't colliding

## Performance Considerations

- Service handles 10K+ req/min in production
- Gateway timeout: 30 seconds
- Database connection pool: 25 connections
- RabbitMQ prefetch: 10 messages
- Horizontal scaling: Stateless, can add instances freely

## Related Documentation
- **Parent System:** [../CLAUDE.md](../CLAUDE.md)
- **API Gateway:** [../payment-api/CLAUDE.md](../payment-api/CLAUDE.md)
- **Fraud Detection:** [../fraud-detection/CLAUDE.md](../fraud-detection/CLAUDE.md)
- **Runbook:** [../docs/runbooks/payment-processor.md](../docs/runbooks/payment-processor.md)
```

---

## Key Takeaways from Examples

### Single Repo Example Highlights
✅ Specific versions everywhere
✅ Actual directory structure with explanations
✅ Real code patterns and where to find them
✅ Known issues with workarounds
✅ Project-specific conventions (not generic)
✅ Common tasks with actual commands
✅ Troubleshooting with real solutions

### Multi-Repo Parent Example Highlights  
✅ System overview with concrete scale
✅ Repository roles clearly explained
✅ Service dependencies visualized
✅ Local development setup explained
✅ Cross-repo workflows documented
✅ Links to individual repo documentation
✅ Architectural decisions explained

### Multi-Repo Child Example Highlights
✅ This service's specific role
✅ What it IS and ISN'T responsible for
✅ Integration points clearly listed
✅ Events published and consumed
✅ Link back to parent documentation
✅ Service-specific setup and commands
✅ Common service-specific tasks
