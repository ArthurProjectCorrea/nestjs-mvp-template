# Manual Testing Guide - User CRUD API

## 🎯 Testing Overview

This guide provides step-by-step instructions to manually test all User CRUD endpoints.

## 🚀 Prerequisites

1. **Start Docker Environment**:

   ```bash
   pnpm run docker:up
   ```

2. **Verify Services**:
   - Application: http://localhost:4000
   - Swagger Docs: http://localhost:4000/api/docs
   - Prisma Studio: http://localhost:5555

3. **Seed Database (Optional)**:
   ```bash
   pnpm run db:seed
   ```

## 📋 Test Cases

### Test 1: Create User (POST /api/v1/users)

**Request:**

```bash
curl -X POST http://localhost:4000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Expected Response (201):**

```json
{
  "id": 1,
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "isActive": true,
  "createdAt": "2025-10-07T20:XX:XX.XXXZ"
}
```

**Validation Tests:**

```bash
# Test validation - missing email
curl -X POST http://localhost:4000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "password": "test123"}'

# Test validation - invalid email
curl -X POST http://localhost:4000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "invalid", "password": "test123"}'

# Test validation - short password
curl -X POST http://localhost:4000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test2@example.com", "password": "123"}'
```

### Test 2: Get All Users (GET /api/v1/users)

**Request:**

```bash
curl http://localhost:4000/api/v1/users
```

**Expected Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2025-10-07T20:XX:XX.XXXZ"
    }
  ]
}
```

### Test 3: Get User by ID (GET /api/v1/users/:id)

**Request:**

```bash
curl http://localhost:4000/api/v1/users/1
```

**Expected Response (200):**

```json
{
  "id": 1,
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "isActive": true,
  "createdAt": "2025-10-07T20:XX:XX.XXXZ"
}
```

**Test Not Found:**

```bash
curl http://localhost:4000/api/v1/users/999
# Expected: 404 Not Found
```

### Test 4: Update User (PATCH /api/v1/users/:id)

**Request:**

```bash
curl -X PATCH http://localhost:4000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test User"
  }'
```

**Expected Response (200):**

```json
{
  "id": 1,
  "name": "Updated Test User",
  "email": "test@example.com",
  "role": "user",
  "isActive": true,
  "createdAt": "2025-10-07T20:XX:XX.XXXZ"
}
```

**Test Email Update:**

```bash
curl -X PATCH http://localhost:4000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "updated@example.com"
  }'
```

**Test Password Update:**

```bash
curl -X PATCH http://localhost:4000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123"
  }'
```

### Test 5: Soft Delete User (DELETE /api/v1/users/:id)

**Request:**

```bash
curl -X DELETE http://localhost:4000/api/v1/users/1
```

**Expected Response (204):**

- No content body
- Status: 204 No Content

**Verify Soft Delete:**

```bash
# User should not appear in list (isActive = false)
curl http://localhost:4000/api/v1/users

# Direct access should return 404
curl http://localhost:4000/api/v1/users/1
```

## 🔒 Security Testing

### Test 6: Duplicate Email Prevention

```bash
# Create first user
curl -X POST http://localhost:4000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User One",
    "email": "duplicate@example.com",
    "password": "password123"
  }'

# Try to create user with same email
curl -X POST http://localhost:4000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User Two",
    "email": "duplicate@example.com",
    "password": "password456"
  }'
# Expected: 409 Conflict
```

### Test 7: Password Security

**Verify password is not returned:**

```bash
curl http://localhost:4000/api/v1/users/1
# Response should NOT contain password field
```

**Check password is hashed in database:**

- Open Prisma Studio: http://localhost:5555
- Navigate to User table
- Verify password field contains bcrypt hash, not plain text

## 🎨 Swagger UI Testing

1. **Open Swagger UI**: http://localhost:4000/api/docs
2. **Test each endpoint** using the interactive interface
3. **Verify request/response schemas**
4. **Test validation** through the UI

## ✅ Expected Results Summary

| Test             | Endpoint          | Expected Status | Notes                         |
| ---------------- | ----------------- | --------------- | ----------------------------- |
| Create User      | POST /users       | 201             | Returns user without password |
| Get All Users    | GET /users        | 200             | Returns data array            |
| Get User by ID   | GET /users/:id    | 200             | Returns single user           |
| Get Non-existent | GET /users/999    | 404             | Not found error               |
| Update User      | PATCH /users/:id  | 200             | Returns updated user          |
| Delete User      | DELETE /users/:id | 204             | No content                    |
| Get Deleted User | GET /users/:id    | 404             | Soft deleted = not found      |
| Duplicate Email  | POST /users       | 409             | Conflict error                |
| Invalid Data     | POST /users       | 400             | Validation error              |

## 🔍 Database Verification

Use **Prisma Studio** (http://localhost:5555) to verify:

1. **User Creation**: New records appear in User table
2. **Password Hashing**: Password field contains bcrypt hash
3. **Soft Delete**: `isActive` field set to `false` for deleted users
4. **Data Integrity**: All fields properly stored and typed

## 🐛 Troubleshooting

### Common Issues:

1. **Connection Refused**:

   ```bash
   pnpm run docker:up
   docker-compose ps  # Check all services are running
   ```

2. **Database Errors**:

   ```bash
   pnpm run db:migrate  # Ensure migrations are applied
   ```

3. **Validation Errors**:
   - Check request body format (JSON)
   - Verify Content-Type header
   - Ensure required fields are present

4. **404 on Existing ID**:
   - User might be soft-deleted (isActive = false)
   - Check actual IDs in Prisma Studio

## 📊 Performance Testing

**Load Test Example:**

```bash
# Create multiple users rapidly
for i in {1..10}; do
  curl -X POST http://localhost:4000/api/v1/users \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"User $i\",\"email\":\"user$i@example.com\",\"password\":\"password123\"}" &
done
wait
```

## 🎯 Success Criteria

✅ All endpoints respond correctly
✅ Validation works properly
✅ Passwords are hashed and not returned
✅ Soft delete functions correctly
✅ Email uniqueness enforced
✅ Swagger documentation accessible
✅ Database state consistent
✅ Error handling appropriate
