# GitHub Spec Kit - Usage Guide

## ✅ Installation Completed Successfully!

Your Spec Kit has been properly initialized with GitHub Copilot support.

## How to Use Slash Commands

### ⚠️ Important: Where to Use Slash Commands

The slash commands like `/analyze`, `/constitution`, `/specify`, etc. are **GitHub Copilot Chat commands** that you use **inside your code editor**, NOT in the terminal.

### Using Slash Commands in VS Code / Cursor / GitHub Copilot Chat

1. **Open your code editor** (VS Code, Cursor, or any editor with GitHub Copilot)
2. **Open GitHub Copilot Chat panel** (usually `Ctrl+I` or `Cmd+I`)
3. **Type the slash command** in the chat input, for example:
   - `/constitution`
   - `/specify`
   - `/plan`
   - `/tasks`
   - `/analyze`
   - `/implement`

### Example Workflow

```
1. In Copilot Chat: /constitution
   → Establishes project principles

2. In Copilot Chat: /specify
   → Creates baseline specification (creates spec.md)

3. In Copilot Chat: /plan
   → Creates implementation plan (creates plan.md)

4. In Copilot Chat: /tasks
   → Generates actionable tasks (creates tasks.md)

5. In Copilot Chat: /analyze
   → Analyzes consistency across spec.md, plan.md, tasks.md

6. In Copilot Chat: /implement
   → Executes implementation
```

## How GitHub Copilot Finds Your Prompts

GitHub Copilot automatically discovers slash commands from:
- `.github/prompts/*.prompt.md` files in your repository

Your installed prompts are located at:
```
/home/ubuntu/src/repos/katalyst/core/.github/prompts/
├── analyze.prompt.md
├── clarify.prompt.md
├── constitution.prompt.md
├── implement.prompt.md
├── plan.prompt.md
├── specify.prompt.md
└── tasks.prompt.md
```

## Troubleshooting

### If slash commands don't appear:

1. **Restart your code editor** after Spec Kit initialization
2. **Ensure GitHub Copilot extension is installed and enabled**
3. **Check you're authenticated** with GitHub in your editor
4. **Verify Copilot subscription is active**

### To test if Copilot can see your prompts:

1. Open GitHub Copilot Chat
2. Type `/` and see if custom commands appear
3. If not, try reloading the editor window

### Debug logs location:

**VS Code:**
- View → Output → Select "GitHub Copilot" from dropdown
- View → Output → Select "GitHub Copilot Chat" from dropdown

**Command line check:**
```bash
# Verify prompts are installed
ls -la .github/prompts/

# Check prerequisites for spec workflow
.specify/scripts/bash/check-prerequisites.sh
```

## Terminal vs Editor Commands

### ✅ Terminal Commands (CLI):
```bash
specify init                    # Initialize Spec Kit (already done!)
specify check                   # Check required tools
.specify/scripts/bash/check-prerequisites.sh  # Check spec prerequisites
```

### ✅ Editor Commands (GitHub Copilot Chat):
```
/constitution      # Inside Copilot Chat
/specify           # Inside Copilot Chat
/plan              # Inside Copilot Chat
/tasks             # Inside Copilot Chat
/analyze           # Inside Copilot Chat
/implement         # Inside Copilot Chat
/clarify           # Inside Copilot Chat (optional)
```

## Next Steps

1. Open your project in VS Code or Cursor
2. Open GitHub Copilot Chat panel
3. Start with: `/constitution`
4. Follow the workflow above

## Support

If you encounter issues:
1. Check GitHub Copilot extension is enabled
2. Verify authentication with GitHub
3. Check the Output panel for error messages
4. Restart your editor after installation

Happy spec-driven development! 🚀
