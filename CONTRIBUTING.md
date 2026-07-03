# Contributing to Apex Ride Admin Panel

Thank you for your interest in contributing to Apex Ride Admin Panel! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to salahuddin@nextora.studio.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Browser and OS information
- Screenshots if applicable

### Suggesting Features

Feature requests are welcome. Please provide:

- A clear description of the feature
- The motivation/use case
- Any implementation ideas you have

### Contributing Code

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm
- Git

### Local Development

```bash
# Fork and clone the repo
git clone https://github.com/your-username/car-rental_admin.git

# Navigate to project directory
cd car-rental_admin

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server runs at `http://localhost:5173` by default.

### Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run linter |
| `npm run preview` | Preview production build |

## Branch Naming

Use descriptive branch names with prefixes:

| Prefix | Purpose |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `style/` | Code style changes (formatting, no logic change) |
| `refactor/` | Code refactoring |
| `test/` | Adding or updating tests |
| `chore/` | Maintenance tasks |

Example: `feat/add-car-search-filter`

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semi-colons, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **test**: Adding or correcting tests
- **chore**: Maintenance activities

### Examples

```
feat(cars): add search filter functionality
fix(dashboard): resolve stats calculation error
docs(readme): update installation instructions
style(components): fix indentation issues
refactor(store): simplify state management logic
```

## Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic

3. **Test Your Changes**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Create Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all checks pass

### PR Requirements

- Code must pass linting
- Build must succeed
- No TypeScript errors
- Changes must be tested manually
- PR description must clearly explain the changes

## Coding Standards

### TypeScript

- Use strict TypeScript types
- Avoid `any` type when possible
- Define interfaces for component props
- Use type inference where appropriate

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop destructuring

### Styling

- Use TailwindCSS utility classes
- Follow existing color scheme and design tokens
- Ensure responsive design
- Support dark mode

### File Organization

- Components go in `src/components/`
- Pages go in `src/pages/`
- Store files go in `src/store/`
- Keep related files close together

## Reporting Bugs

### Before Reporting

1. Check existing issues for duplicates
2. Verify the bug on the latest version
3. Try to reproduce with minimal steps

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node.js version: [e.g., 20.10]
```

## Requesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. "I'm frustrated when..."

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

## Questions?

For questions about contributing, feel free to open an issue or contact:

- **Email**: salahuddin@nextora.studio
- **GitHub**: [@salahuddingfx](https://github.com/salahuddingfx)

Thank you for contributing! Your help makes this project better for everyone.
