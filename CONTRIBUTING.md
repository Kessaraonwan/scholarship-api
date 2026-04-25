# Contributing Guide

บทแนะนำการมีส่วนร่วมพัฒนา Scholarship API

---

## 📋 ก่อนเริ่ม

### สิ่งที่ต้องติดตั้ง
- Node.js v18+
- Docker & Docker Compose
- Git
- VS Code (recommended) + Prettier + ESLint extensions

### Setup Repository

```bash
# 1. Clone
git clone https://github.com/your-org/scholarship-api.git
cd scholarship-api

# 2. Setup script (first time only)
./setup.bat your-service-name
# or
bash setup.sh your-service-name

# 3. Install dependencies
cd service-your-name
npm install

# 4. Start dev server
npm run dev
```

---

## 🌳 Git Workflow

### Branch Strategy

```
main (production)
 ↑
 ├── dev (staging)
 │    ↑
 │    ├── feat/auth (feature branches)
 │    ├── feat/core
 │    ├── feat/analytics
 │    └── bugfix/issue-123
```

### Rules

- ❌ **Never** push directly to `main`
- ❌ **Never** push directly to `dev` (except for releases)
- ✅ Always create feature branch from `dev`
- ✅ Always make PR for review before merging
- ✅ At least 1 approval required (from another team member)

### Daily Workflow

```bash
# 1. Update from dev (always do this first!)
git pull origin dev

# 2. Create feature branch
git checkout -b feat/your-feature

# 3. Make changes & commit
git add .
git commit -m "feat: add new feature"

# 4. Push to your branch
git push origin feat/your-feature

# 5. Create Pull Request on GitHub
# → Target: dev branch
# → Assign reviewer: another team member
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `style` - CSS/styling changes
- `test` - Adding tests
- `docs` - Documentation
- `chore` - Maintenance tasks

**Examples**:
```
feat(auth): add JWT token validation
fix(core): handle null scholarship data
refactor(landing): extract navbar to component
docs(api): update endpoint examples
```

---

## 📝 Code Style

### Linting & Formatting

```bash
# Check code style
npm run lint

# Auto-fix issues
npm run lint -- --fix

# Type checking
npm run type-check
```

### Rules

- Use TypeScript for all new files
- Follow ESLint configuration
- Use Prettier for formatting (auto on save)
- Max line length: 100 characters
- Use meaningful variable names
- Add comments for complex logic

### Code Example

```typescript
// ✅ Good
export async function fetchScholarships(
  filters: ScholarshipFilters
): Promise<Scholarship[]> {
  const response = await api.get('/scholarships', { params: filters });
  return response.data;
}

// ❌ Bad
export async function getSchools(f: any) {
  let x = axios.get('/scholarships?country=' + f.c);
  return x;
}
```

---

## 🧪 Testing

### Writing Tests

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Test Structure

```typescript
describe('Scholarship Search', () => {
  it('should filter scholarships by country', () => {
    const result = filterScholarships(mockData, { country: 'TH' });
    expect(result).toHaveLength(5);
  });

  it('should handle empty results', () => {
    const result = filterScholarships([], { country: 'US' });
    expect(result).toEqual([]);
  });
});
```

---

## 🐳 Docker Development

### Building Locally

```bash
# Build single service
docker build -t service-landing .

# Build all services
docker-compose build

# Build without cache
docker-compose build --no-cache
```

### Running Services

```bash
# Start all
docker-compose up

# Start single service
docker-compose up service-landing

# Background mode
docker-compose up -d

# View logs
docker-compose logs -f service-landing

# Stop all
docker-compose down

# Remove volumes
docker-compose down -v
```

---

## 🔍 Code Review Process

### As an Author

1. Create clear, focused PR
2. Write descriptive PR title & description
3. Link related issues
4. Request review from teammate
5. Address review comments promptly
6. Don't merge your own PR

### As a Reviewer

1. Read PR description & linked issue
2. Review code changes
3. Run locally if needed
4. Check for:
   - ✅ TypeScript types
   - ✅ No console.logs in production
   - ✅ Proper error handling
   - ✅ No hardcoded secrets
   - ✅ Tests included
5. Approve or request changes

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
Steps to verify changes

## Checklist
- [ ] Code follows style guidelines
- [ ] No new warnings
- [ ] Added tests
- [ ] Updated documentation
```

---

## 🚀 Deployment

### Staging (dev branch)

```bash
# GitHub Actions automatically deploys on push to dev
# Check: Settings → Actions
```

### Production (main branch)

```bash
# Create release tag
git tag v1.2.3
git push origin v1.2.3

# GitHub Actions automatically deploys
# Check workflow progress on GitHub Actions tab
```

---

## 📚 Documentation

### Where to Document

- **Code**: JSDoc comments for functions
- **API**: Update `/docs` if adding endpoints
- **Processes**: README in service folder
- **Architecture**: DEVELOPMENT_GUIDE.md

### Documentation Example

```typescript
/**
 * Search scholarships with filters
 * @param filters - Search filters
 * @param filters.country - Country code (e.g., 'TH')
 * @param filters.minAmount - Minimum scholarship amount
 * @returns Array of matching scholarships
 */
export async function searchScholarships(
  filters: ScholarshipFilters
): Promise<Scholarship[]> {
  // implementation
}
```

---

## 🐛 Debugging

### VS Code Debug Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### Common Issues

```bash
# Port already in use
lsof -i :3000
kill -9 <PID>

# Dependencies conflict
rm -rf node_modules package-lock.json
npm install

# Docker issues
docker system prune
docker-compose down -v
docker-compose up --build
```

---

## 📞 Team Communication

### Channels

- **Slack #engineering** - Quick questions, updates
- **GitHub Discussions** - Technical discussions
- **GitHub Issues** - Bug reports, feature requests
- **Meetings** - Monday 10am, Thursday 3pm (Optional)

### When to Communicate

- Blocked or need help? → Slack
- Design decision? → GitHub Discussion
- Found a bug? → GitHub Issue
- Ready for review? → GitHub PR with mention

---

## 🎯 Service Responsibilities

| Service | Owner | Port | Focus |
|---------|-------|------|-------|
| Auth | แบงค์ | 3001 | Login, API Keys, Users |
| Ingestion | มิก | 3002 | Data Scraping, Import |
| Core | อีฟ | 3003 | Scholarship Search, Data |
| Analytics | ภู | 3004 | Matching, Dashboard |
| Notification | ปิ่น | 3005 | Email, Webhooks |
| Landing | ซี | 3000 | Frontend, Docs |

---

## ✅ Checklist Before Merging

- [ ] Tests passing locally
- [ ] No console.logs
- [ ] No API keys/secrets in code
- [ ] TypeScript types complete
- [ ] PR has description
- [ ] At least 1 approval
- [ ] All CI/CD checks passing

---

## 📖 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Git Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [Docker Docs](https://docs.docker.com/)

---

## 🤝 Questions?

- Check DEVELOPMENT_GUIDE.md
- Ask in Slack #engineering
- Open GitHub Discussion
- Schedule with team lead

---

**Last Updated**: April 25, 2026  
**Questions?** → Ask in #engineering Slack channel
