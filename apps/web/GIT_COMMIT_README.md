# Git Commit Script for Neuron Web Application

This directory contains an automated git commit script that helps you push all the Neuron web application files to GitHub in an organized, commit-by-commit manner.

## 📋 Overview

The `git-commit-script.sh` script automates the process of creating 22 separate, well-organized commits for the Neuron web application, following the commit plan outlined in `GIT_COMMIT_PLAN.md`.

## 🚀 Quick Start

### Prerequisites

1. **Git Repository**: Ensure you're in a git repository (run `git init` if needed)
2. **Remote Repository**: Add your remote repository: `git remote add origin <your-repo-url>`
3. **All Files Present**: Make sure all the files mentioned in the commit plan exist in your project

### Usage

1. **Navigate to the web directory**:
   ```bash
   cd apps/web
   ```

2. **Run the script**:
   ```bash
   ./git-commit-script.sh
   ```

3. **Follow the prompts**:
   - The script will guide you through each commit
   - It will ask if you want to push to the remote repository at the end
   - You can choose to push manually if preferred

## 📝 Commit Structure

The script creates 22 commits following this structure:

| #   | Commit Type  | Description                         |
| --- | ------------ | ----------------------------------- |
| 1   | `chore(web)` | Project scaffolding & configuration |
| 2   | `style(web)` | Global styles & design tokens       |
| 3   | `feat(web)`  | Core types & shared utilities       |
| 4   | `feat(web)`  | Application bootstrap & routing     |
| 5   | `feat(web)`  | Global state (Zustand stores)       |
| 6   | `feat(web)`  | API client & type definitions       |
| 7   | `feat(web)`  | Mock API infrastructure             |
| 8   | `feat(web)`  | Mock data barrel                    |
| 9   | `feat(web)`  | React Query data hooks              |
| 10  | `feat(web)`  | AI chat service                     |
| 11  | `feat(web)`  | Shared UI component library         |
| 12  | `feat(web)`  | Layout components                   |
| 13  | `feat(web)`  | Dashboard chart components          |
| 14  | `feat(web)`  | Dashboard widget components         |
| 15  | `feat(web)`  | Dashboard top-level components      |
| 16  | `feat(web)`  | Accounts feature components         |
| 17  | `feat(web)`  | Transactions feature components     |
| 18  | `feat(web)`  | Chat feature components             |
| 19  | `feat(web)`  | Emergency fund component            |
| 20  | `feat(web)`  | All application pages               |
| 21  | `test(web)`  | E2E tests (Playwright)              |
| 22  | `docs(web)`  | Documentation & audit files         |

## 🔧 Script Features

### Error Handling
- **Repository Check**: Verifies you're in a git repository
- **File Validation**: Warns if files are missing before attempting to add them
- **Exit on Error**: Stops execution if any git command fails

### User Experience
- **Progress Display**: Shows which commit is being processed
- **File Listing**: Displays which files are being added to each commit
- **Final Summary**: Shows recent commits and final status
- **Push Confirmation**: Asks before pushing to remote repository

### Commit Messages
Each commit follows conventional commit format:
```
<type>(<scope>): <description>

<body>

<footer>
```

## 🛠️ Manual Usage

If you prefer to run commits manually, you can use the individual git commands:

```bash
# Example for Commit 1
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js postcss.config.js tailwind.config.js index.html .gitignore .env.example
git commit -m "chore(web): add project scaffolding and build configuration

Sets up the Vite + React + TypeScript project foundation including
package.json with all dependencies, tsconfig files, vite config,
eslint rules, postcss/tailwind setup, and the main HTML entry point."
```

## ⚠️ Important Notes

### Before Running
1. **Initialize Git**: Run `git init` if not already done
2. **Add Remote**: `git remote add origin <your-repo-url>`
3. **Check Files**: Ensure all files exist before running
4. **Backup**: Consider backing up your work

### During Execution
- **Don't Interrupt**: Let the script complete each commit
- **Monitor Output**: Watch for any warnings about missing files
- **Review Commits**: Check commit messages are correct

### After Completion
- **Verify Push**: Check that commits were pushed to remote
- **Review History**: Use `git log --oneline` to verify all commits
- **Check Remote**: Verify commits appear on GitHub/GitLab

## 🐛 Troubleshooting

### "Not in a git repository"
```bash
git init
git remote add origin <your-repo-url>
```

### "File not found" warnings
- Check that all files exist in the correct paths
- Verify file names match exactly (case-sensitive)
- Ensure you're running from the correct directory (`apps/web`)

### Push failures
- Verify remote repository URL is correct
- Check internet connection
- Ensure you have push permissions to the remote repository

### Script execution issues
```bash
# Make sure script is executable
chmod +x git-commit-script.sh

# Run with bash explicitly if needed
bash git-commit-script.sh
```

## 📚 Related Files

- `GIT_COMMIT_PLAN.md` - Detailed commit plan and file structure
- `README.md` - Main project documentation
- `CODEBASE_AUDIT.md` - Codebase structure analysis
- `IDEAL_STRUCTURE.md` - Recommended project organization

## 🤝 Contributing

If you find issues with the script or want to suggest improvements:

1. Check the existing issues
2. Create a new issue with details
3. Submit a pull request with your changes

## 📄 License

This script is part of the Neuron project. See the main project LICENSE file for details.