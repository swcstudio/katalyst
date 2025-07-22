# Katalyst Repository Management Guide

This guide provides comprehensive information for managing the Katalyst-React Framework repository.

## Repository Information

- **Repository**: https://github.com/swcstudio/katalyst
- **Owner**: SomeRandmGuyy (swcstudio)
- **Framework**: React 19 with Micro-Frontend Architecture
- **Primary Branch**: `main`
- **Local Path**: `~/src/katalyst/`

## Quick Setup

```bash
# Clone and setup (if starting fresh)
git clone https://github.com/swcstudio/katalyst.git
cd katalyst
./setup-repo.sh

# Daily development
git pull origin main
npm run dev
```

## Repository Structure

```
katalyst/
├── .github/           # GitHub workflows and templates
├── .nx/              # NX monorepo cache and configuration
├── .storybook/       # Storybook configuration
├── core/             # Pure React web application
├── nextjs/           # Marketing website variant
├── remix/            # Admin dashboard variant
├── shared/           # Common utilities and integrations
├── tests/            # Cross-cutting tests
├── README.md         # Project documentation
├── package.json      # Dependencies and scripts
├── nx.json           # NX workspace configuration
├── tsconfig.json     # TypeScript configuration
└── setup-repo.sh     # Repository setup script
```

## Git Workflow

### Branch Strategy
- **main**: Production-ready code
- **feature/***: New features (`feature/user-authentication`)
- **fix/***: Bug fixes (`fix/login-validation`)
- **chore/***: Maintenance tasks (`chore/update-dependencies`)

### Common Git Commands

```bash
# Check status and sync
git status
git pull origin main

# Create feature branch
git checkout -b feature/new-feature-name
git push -u origin feature/new-feature-name

# Commit changes
git add .
git commit -m "feat: add new authentication system"
git push origin feature/new-feature-name

# Merge to main
git checkout main
git pull origin main
git merge feature/new-feature-name
git push origin main

# Clean up
git branch -d feature/new-feature-name
git push origin --delete feature/new-feature-name
```

### Commit Message Convention

Follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

## Development Commands

### Core Development
```bash
# Start all variants
npm run dev

# Start individual variants
npm run dev:core      # Port 3000 - Core web app
npm run dev:remix     # Port 3001 - Admin dashboard
npm run dev:nextjs    # Port 3002 - Marketing site

# Build for production
npm run build
npm run build:core
npm run build:remix
npm run build:nextjs
```

### Quality Assurance
```bash
# Testing
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report

# Code Quality
npm run lint          # Biome linting
npm run lint:fix      # Auto-fix issues
npm run typecheck     # TypeScript checking
npm run format        # Format code

# Component Development
npm run storybook     # Start Storybook
```

### Package Management
```bash
# Install dependencies
npm install

# Update dependencies
npm update
npm audit fix

# Add new dependency
npm install package-name
npm install -D package-name  # Dev dependency
```

## Environment Configuration

### Environment Variables
Create `.env` file in root:
```bash
NODE_ENV=development
CORE_PORT=3000
REMIX_PORT=3001
NEXTJS_PORT=3002
API_URL=http://localhost:4000
```

### IDE Configuration
Recommended VSCode extensions:
- Biome (linting/formatting)
- Tailwind CSS IntelliSense
- TypeScript Importer
- Playwright Test for VSCode

## Security Considerations

### Sensitive Information
- Never commit API keys, tokens, or passwords
- Use environment variables for configuration
- Add sensitive files to `.gitignore`
- Regularly rotate access tokens

### Repository Access
- Current PAT: `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`
- Consider using SSH keys for better security
- Regularly review repository access and permissions

### Security Best Practices
```bash
# Check for vulnerabilities
npm audit
npm audit fix

# Update dependencies regularly
npm update

# Use security-focused linting rules
npm run lint -- --security
```

## Deployment

### Preparation
```bash
# Ensure clean working directory
git status

# Run full test suite
npm run test
npm run lint
npm run typecheck

# Build all variants
npm run build
```

### Release Process
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.0.0`
4. Push changes: `git push origin main --tags`
5. Create GitHub release

## Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear caches
rm -rf node_modules package-lock.json
npm install

# Clear NX cache
npx nx reset

# Clear TypeScript cache
rm -rf .tsc-cache
```

**Git Issues**
```bash
# Reset to last commit
git reset --hard HEAD

# Fix merge conflicts
git status
# Edit conflicted files
git add .
git commit

# Sync with remote
git fetch origin
git reset --hard origin/main
```

**Development Server Issues**
```bash
# Check port availability
lsof -i :3000
lsof -i :3001
lsof -i :3002

# Kill processes if needed
kill -9 <PID>

# Restart development server
npm run dev
```

### Performance Optimization
```bash
# Analyze bundle size
npm run build
npm run analyze

# Profile development build
npm run dev -- --profile

# Check dependencies
npm ls
npm outdated
```

## Maintenance Tasks

### Weekly Tasks
- [ ] Pull latest changes: `git pull origin main`
- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Check for outdated packages: `npm outdated`

### Monthly Tasks
- [ ] Review and clean up branches
- [ ] Update documentation
- [ ] Review security settings
- [ ] Check repository insights and activity

### Quarterly Tasks
- [ ] Major dependency updates
- [ ] Security review
- [ ] Performance audit
- [ ] Repository backup verification

## Resources

### Documentation
- [README.md](./README.md) - Project overview
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](./CHANGELOG.md) - Version history

### External Links
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [NX Documentation](https://nx.dev)

### Support
- GitHub Issues: https://github.com/swcstudio/katalyst/issues
- Repository Owner: SomeRandmGuyy
- Email: oveshen.govender@gmail.com

---

## Quick Reference Commands

```bash
# Daily workflow
git pull && npm run dev

# Before committing
npm run lint && npm run test && npm run typecheck

# Emergency reset
git stash && git reset --hard origin/main

# Full rebuild
rm -rf node_modules && npm install && npm run build
```

---

*Last updated: $(date)*
*Repository: https://github.com/swcstudio/katalyst*
