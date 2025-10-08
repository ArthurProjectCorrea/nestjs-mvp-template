# Bug Report

## 🐛 Bug Description

<!-- Provide a clear and concise description of the bug -->

## 🎯 Bug Type

<!-- Mark the relevant option with an "x" -->

- [ ] 🚨 **Critical** - Application crash or data loss
- [ ] 🔴 **High** - Major functionality broken
- [ ] 🟡 **Medium** - Feature not working as expected
- [ ] 🟢 **Low** - Minor issue or cosmetic problem
- [ ] 🔐 **Security** - Security vulnerability
- [ ] ⚡ **Performance** - Performance issue
- [ ] 📱 **API** - API endpoint issue
- [ ] 🗄️ **Database** - Database-related issue
- [ ] 🔧 **Configuration** - Environment or config issue

## 📍 Environment

<!-- Information about the environment where the bug occurs -->

- **OS**: (e.g., Windows 11, Ubuntu 22.04, macOS 13)
- **Node.js Version**: (e.g., 20.11.0)
- **Package Manager**: (e.g., pnpm 10.12.1)
- **API Version**: (e.g., v1.0.0)
- **Environment**: (e.g., development, staging, production)

## 🔄 Steps to Reproduce

<!-- Clear steps to reproduce the behavior -->

1.
2.
3.
4.

## ✅ Expected Behavior

<!-- Describe what you expected to happen -->

## ❌ Actual Behavior

<!-- Describe what actually happened -->

## 📸 Evidence

### Error Messages

<!-- Include any error messages, stack traces, or logs -->

```
Paste error messages here
```

### Screenshots

<!-- If applicable, add screenshots to help explain the problem -->

### Code Examples

<!-- Include relevant code snippets that trigger the bug -->

```typescript
// Example code that reproduces the issue
```

### API Request/Response

<!-- If API-related, include request and response examples -->

```bash
# Request
curl -X POST http://localhost:4000/api/v1/endpoint \
  -H "Content-Type: application/json" \
  -d '{"data": "value"}'

# Response
HTTP/1.1 500 Internal Server Error
{
  "error": "Error message"
}
```

## 🔍 Investigation

### What I've Tried

<!-- List troubleshooting steps you've already attempted -->

- [ ] Cleared cache and restarted application
- [ ] Checked environment variables
- [ ] Verified database connection
- [ ] Reviewed logs for additional context
- [ ] Tested with different input data
- [ ]

### Potential Root Cause

<!-- If you have insights into what might be causing the issue -->

## 📊 Impact Assessment

### Users Affected

<!-- How many users or use cases are affected? -->

- [ ] **All users** - Everyone experiences this issue
- [ ] **Specific users** - Only certain users/conditions
- [ ] **Edge case** - Rare occurrence
- [ ] **Single user** - Only affects me

### Business Impact

<!-- What's the business/operational impact? -->

- [ ] **Service disruption** - API is down or unusable
- [ ] **Feature unavailable** - Specific functionality broken
- [ ] **Data integrity** - Data corruption or loss risk
- [ ] **Security risk** - Potential security vulnerability
- [ ] **User experience** - Poor UX but functional
- [ ] **Development blocked** - Prevents development work

## 🔗 Related Information

### Related Issues

<!-- Link to related issues or similar problems -->

- Related to: #issue-number
- Duplicate of: #issue-number
- Caused by: #issue-number

### Recent Changes

<!-- Any recent changes that might be related -->

- Recent deployments:
- Recent code changes:
- Recent configuration changes:

## 📝 Additional Context

### System Logs

<!-- Include relevant system/application logs -->

```
[2025-10-03 12:00:00] ERROR: Error message
[2025-10-03 12:00:01] DEBUG: Additional context
```

### Database State

<!-- If database-related, include relevant data or schema info -->

### Performance Metrics

<!-- If performance-related, include metrics -->

## 🛠️ Proposed Solution

<!-- If you have ideas for fixing the issue -->

### Immediate Fix

<!-- Short-term solution to resolve the issue -->

### Long-term Solution

<!-- Proper fix to prevent the issue from recurring -->

## ✅ Definition of Done

<!-- What needs to be completed to consider this bug fixed? -->

- [ ] Bug is reproducible in test environment
- [ ] Root cause is identified and documented
- [ ] Fix is implemented and tested
- [ ] Unit tests cover the bug scenario
- [ ] E2E tests validate the fix
- [ ] No regression in existing functionality
- [ ] Documentation updated (if needed)
- [ ] Code review completed
- [ ] Fix is deployed and verified

## 🧪 Testing Instructions

<!-- How to verify that the bug is fixed -->

1.
2.
3.

## 🚀 Priority & Timeline

### Priority Level

- [ ] 🔴 **P0 - Critical** - Fix immediately, hotfix required
- [ ] 🟡 **P1 - High** - Fix in current sprint
- [ ] 🟢 **P2 - Medium** - Fix in next sprint
- [ ] 🔵 **P3 - Low** - Fix when time permits

### Target Resolution

- **Expected Fix Date**:
- **Affected Release**:
- **Hotfix Required**: Yes/No
