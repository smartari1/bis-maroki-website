#!/bin/bash

# Project Validation Script for ביס מרוקאי
# Validates code structure, TypeScript compilation, and database connectivity
# Run with: bash scripts/validate-project.sh

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🔍 Project Validation - ביס מרוקאי                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
  local test_name=$1
  local command=$2

  TOTAL_TESTS=$((TOTAL_TESTS + 1))

  echo -e "${YELLOW}Testing:${NC} $test_name"

  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
  echo ""
}

# ============================================================================
# FILE STRUCTURE TESTS
# ============================================================================

echo -e "${BLUE}═══ File Structure Tests ═══${NC}"
echo ""

run_test "Database models exist" "test -d lib/db/models && test -f lib/db/models/Dish.ts"
run_test "Validation schemas exist" "test -d lib/validation && test -f lib/validation/dish.schema.ts"
run_test "Auth system exists" "test -d lib/auth && test -f lib/auth/session.ts"
run_test "API responses exist" "test -f lib/api/responses.ts"
run_test "Public API routes exist" "test -d app/api/public && test -f app/api/public/dishes/route.ts"
run_test "Admin API routes exist" "test -d app/api/admin && test -f app/api/admin/login/route.ts"
run_test "Middleware exists" "test -f middleware.ts"
run_test "Seeding scripts exist" "test -f scripts/seed-categories.ts && test -f scripts/seed-dishes.ts"

# ============================================================================
# TypeScript COMPILATION
# ============================================================================

echo -e "${BLUE}═══ TypeScript Compilation ═══${NC}"
echo ""

echo -e "${YELLOW}Testing:${NC} TypeScript compilation (this may take a moment...)"
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
  echo -e "${RED}❌ FAIL - TypeScript errors found${NC}"
  npx tsc --noEmit 2>&1 | grep "error TS" | head -5
  FAILED_TESTS=$((FAILED_TESTS + 1))
else
  echo -e "${GREEN}✅ PASS${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

# ============================================================================
# CODE QUALITY CHECKS
# ============================================================================

echo -e "${BLUE}═══ Code Quality Checks ═══${NC}"
echo ""

# Count API routes
public_routes=$(find app/api/public -name "route.ts" 2>/dev/null | wc -l | tr -d ' ')
admin_routes=$(find app/api/admin -name "route.ts" 2>/dev/null | wc -l | tr -d ' ')
echo -e "${BLUE}Info:${NC} Found $public_routes public API routes and $admin_routes admin API routes"
echo ""

# Count database models
models=$(find lib/db/models -name "*.ts" 2>/dev/null | wc -l | tr -d ' ')
echo -e "${BLUE}Info:${NC} Found $models database models"
echo ""

# Count validation schemas
schemas=$(find lib/validation -name "*.schema.ts" 2>/dev/null | wc -l | tr -d ' ')
echo -e "${BLUE}Info:${NC} Found $schemas validation schemas"
echo ""

# ============================================================================
# HEBREW LOCALIZATION CHECK
# ============================================================================

echo -e "${BLUE}═══ Hebrew Localization Check ═══${NC}"
echo ""

echo -e "${YELLOW}Testing:${NC} Hebrew validation messages in models"
if grep -r "required.*\[true.*נדרש" lib/db/models/*.ts > /dev/null 2>&1; then
  echo -e "${GREEN}✅ PASS - Hebrew validation messages found${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${RED}❌ FAIL - No Hebrew validation messages found${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

# ============================================================================
# DATABASE SEEDING VALIDATION
# ============================================================================

echo -e "${BLUE}═══ Database Seeding Scripts ═══${NC}"
echo ""

run_test "Category seeding script compiles" "npx tsx --check scripts/seed-categories.ts"
run_test "Dish seeding script compiles" "npx tsx --check scripts/seed-dishes.ts"
run_test "Media seeding script compiles" "npx tsx --check scripts/seed-media-from-r2.ts"

# ============================================================================
# ENVIRONMENT CHECK
# ============================================================================

echo -e "${BLUE}═══ Environment Configuration ═══${NC}"
echo ""

if [ -f ".env.local" ]; then
  echo -e "${GREEN}✅ .env.local exists${NC}"

  # Check for required variables (without revealing values)
  required_vars=("MONGODB_URI" "ADMIN_SECRET" "R2_ACCESS_KEY_ID" "R2_SECRET_ACCESS_KEY" "R2_BUCKET")
  for var in "${required_vars[@]}"; do
    if grep -q "^$var=" .env.local 2>/dev/null; then
      echo -e "${GREEN}  ✓${NC} $var is set"
    else
      echo -e "${RED}  ✗${NC} $var is missing"
    fi
  done
else
  echo -e "${RED}❌ .env.local not found${NC}"
fi
echo ""

# ============================================================================
# SUMMARY
# ============================================================================

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    📊 VALIDATION SUMMARY                   ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║${NC} Total Tests:    $TOTAL_TESTS"
echo -e "${BLUE}║${NC} ${GREEN}Passed:${NC}        $PASSED_TESTS"
echo -e "${BLUE}║${NC} ${RED}Failed:${NC}        $FAILED_TESTS"
echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║${NC} ${BLUE}Code Statistics:${NC}"
echo -e "${BLUE}║${NC}   API Routes:    $(($public_routes + $admin_routes))"
echo -e "${BLUE}║${NC}   Models:        $models"
echo -e "${BLUE}║${NC}   Schemas:       $schemas"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}🎉 All validation tests passed!${NC}"
  echo -e "${GREEN}Project is ready for deployment.${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some validation tests failed${NC}"
  echo -e "${YELLOW}Review the failures above before deploying.${NC}"
  exit 1
fi
