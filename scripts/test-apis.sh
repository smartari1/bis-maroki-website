#!/bin/bash

# API Testing Script for ביס מרוקאי
# Tests all public and admin API endpoints
# Run with: bash scripts/test-apis.sh

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
ADMIN_PASSWORD="${ADMIN_SECRET}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    🧪 API Testing Suite - ביס מרוקאי                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
  local test_name=$1
  local method=$2
  local endpoint=$3
  local data=$4
  local expected_status=$5

  TOTAL_TESTS=$((TOTAL_TESTS + 1))

  echo -e "${YELLOW}Testing:${NC} $test_name"

  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
  fi

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$status_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Status: $status_code"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "${RED}❌ FAIL${NC} - Expected: $expected_status, Got: $status_code"
    echo -e "${RED}Response:${NC} $body"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
  echo ""
}

# ============================================================================
# PUBLIC API TESTS
# ============================================================================

echo -e "${BLUE}═══ Public API Tests ═══${NC}"
echo ""

# Test 1: Get all categories
run_test "GET /api/public/categories" "GET" "/api/public/categories" "" 200

# Test 2: Get RESTAURANT categories
run_test "GET /api/public/categories?typeScope=RESTAURANT" "GET" "/api/public/categories?typeScope=RESTAURANT" "" 200

# Test 3: Get all dishes
run_test "GET /api/public/dishes" "GET" "/api/public/dishes" "" 200

# Test 4: Get RESTAURANT dishes
run_test "GET /api/public/dishes?type=RESTAURANT" "GET" "/api/public/dishes?type=RESTAURANT" "" 200

# Test 5: Get dishes with pagination
run_test "GET /api/public/dishes?page=1&limit=5" "GET" "/api/public/dishes?page=1&limit=5" "" 200

# Test 6: Get vegan dishes
run_test "GET /api/public/dishes?isVegan=true" "GET" "/api/public/dishes?isVegan=true" "" 200

# Test 7: Get single dish by slug
run_test "GET /api/public/dishes/pate-kaved" "GET" "/api/public/dishes/pate-kaved" "" 200

# Test 8: Get non-existent dish (should 404)
run_test "GET /api/public/dishes/non-existent-slug" "GET" "/api/public/dishes/non-existent-slug" "" 404

# Test 9: Get settings
run_test "GET /api/public/settings" "GET" "/api/public/settings" "" 200

# ============================================================================
# ADMIN AUTH TESTS
# ============================================================================

echo -e "${BLUE}═══ Admin Authentication Tests ═══${NC}"
echo ""

# Test 10: Login with wrong password (should fail)
run_test "POST /api/admin/login (wrong password)" "POST" "/api/admin/login" '{"password":"wrongpassword"}' 401

# Test 11: Login without password (validation error)
run_test "POST /api/admin/login (no password)" "POST" "/api/admin/login" '{}' 400

# Test 12: Verify without session (should fail)
run_test "GET /api/admin/verify (no session)" "GET" "/api/admin/verify" "" 401

# Note: Testing with correct password would require the actual ADMIN_SECRET
if [ -n "$ADMIN_PASSWORD" ]; then
  echo -e "${YELLOW}Note:${NC} ADMIN_SECRET is set, testing actual login..."
  run_test "POST /api/admin/login (correct password)" "POST" "/api/admin/login" "{\"password\":\"$ADMIN_PASSWORD\"}" 200
else
  echo -e "${YELLOW}Note:${NC} ADMIN_SECRET not set, skipping actual login test"
  echo ""
fi

# ============================================================================
# VALIDATION TESTS
# ============================================================================

echo -e "${BLUE}═══ Validation Tests (should fail with Hebrew messages) ═══${NC}"
echo ""

# Test 13: Invalid query parameter
run_test "GET /api/public/dishes?type=INVALID" "GET" "/api/public/dishes?type=INVALID" "" 400

# ============================================================================
# SUMMARY
# ============================================================================

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    📊 TEST SUMMARY                         ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║${NC} Total Tests:    $TOTAL_TESTS"
echo -e "${BLUE}║${NC} ${GREEN}Passed:${NC}        $PASSED_TESTS"
echo -e "${BLUE}║${NC} ${RED}Failed:${NC}        $FAILED_TESTS"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  exit 1
fi
