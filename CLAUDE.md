# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma-to-Code automation playground that generates React components from Figma designs via GitHub Actions. The workflow is triggered by Jira issues containing Figma design references, which then automatically creates pull requests with generated component code.

## Common Commands

### Development

```bash
pnpm dev          # Start Next.js development server (http://localhost:3000)
pnpm build        # Build production bundle
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Package Management

This project uses `pnpm` (not npm or yarn). Always use `pnpm` for installing dependencies.

## Architecture

### Automation Workflow

The core automation is driven by GitHub Actions workflows that:

1. **Listen for Jira events** via `repository_dispatch` events with types:

   - `feature_component` - Single component generation
   - `feature_entry` - Entry point/screen generation
   - `feature_screen` - Full screen generation

2. **Fetch Figma assets**:

   - Downloads PNG renders via Figma Images API
   - Fetches node metadata via Figma Files API
   - Stores images in `figma/components/`

3. **Generate code via Anthropic API**:

   - Sends Figma PNG + Jira description to Claude
   - Receives JSON response with file path and content
   - Creates component files in `components/` directory

4. **Create PR automatically**:
   - Creates feature branch: `feat/{ISSUE_KEY}-{TIMESTAMP}`
   - Commits generated code
   - Opens PR with Jira issue reference

### Directory Structure

```
app/                    # Next.js App Router pages
  page.tsx             # Main landing page
  layout.tsx           # Root layout with Geist fonts
  globals.css          # Global styles (Tailwind)

components/            # React components (manually created + AI-generated)
  BottomNav.tsx        # Bottom navigation component
  clientCard.tsx       # Client card with menu
  commissions.tsx      # Commissions display
  MarketSegmentCard.tsx
  newsTitle.tsx
  search.tsx

figma/
  components/          # Figma PNG exports (generated)

lib/
  utils.ts            # cn() utility for class merging (clsx + tailwind-merge)

.github/workflows/     # GitHub Actions automation
  component-workflow.yml  # Single component generation
  entry-workflow.yml      # Entry screen generation
  screen-workflow.yml     # Full screen generation
```

### Key Files

#### `workspace-payload.json`

Created during workflow runs, contains:

- `issueKey`: Jira issue identifier
- `summary`: Issue summary
- `description`: Full Jira description with component requirements
- `figmaFileId`: Figma file identifier

#### `anthropic-request.json`

The full API request sent to Claude, including:

- Base64-encoded Figma PNG
- Jira description with component requirements
- Structured prompt for JSON output

#### `figma-imagedata.json`

Response from Figma Images API with image URLs.

### Component Generation Rules

When components are generated via the automation, they follow strict rules defined in the Jira description:

- Must use TailwindCSS (v4) exclusively
- Must match Figma design exactly (spacing, typography, colors, layout)
- Must include ARIA labels and accessibility attributes
- Output format: JSON with `path` and `content` keys
- No markdown code blocks in response

**Example Jira description format:**

```
You are generating a {component} component using the Broker App White Label design system.
You MUST adhere to the Figma metadata and PNG reference located at: [Figma URL]

# Output files
/components/{component}.tsx

# Component rules
- Use only TailwindCSS
- Match exact design in PNG
- Include accessibility attributes

# Absolutely NO deviations
- Do not add buttons not in design
- Do not change colors/spacing/layout
```

## MCP (Model Context Protocol) Configuration

The repository is configured with MCP servers in `.mcp.json`:

- **context7**: Documentation lookup for libraries
- **figma-remote-mcp**: Figma design integration
- **atlassian**: Jira/Confluence integration
- **github**: GitHub operations (contains an API token - rotate if exposed)

## TypeScript Configuration

- Path aliases: `@/*` maps to project root
- Strict mode enabled
- Target: ES2017
- Module resolution: bundler (Next.js)

## Styling

- **TailwindCSS v4** (latest)
- Custom utility: `cn()` in `lib/utils.ts` for conditional classes
- Geist Sans and Geist Mono fonts via `next/font`

## Workflow Secrets Required

When working with GitHub Actions:

- `FIGMA_TOKEN`: Figma API personal access token
- `ANTHROPIC_API_KEY`: Claude API key
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## Development Notes

- Components use Lucide React for icons
- The project follows a design-first approach where all components match Figma pixel-perfect
- Generated components should never deviate from the provided Figma design
- The automation creates PRs but doesn't merge them - manual review is required
- When starting a new feature, first use the figma MCP to pull the design
- When starting a new feature, if the user is currently on the "main" or "feat/agentic-coding-demo" branches, create a new branch using git first before starting any work

## Instructions for MCP Tool Use

- For the purposes of any Atlassian tools, this codebase is associated with the "playground" project, which is follows the ticket prepend format "PLAYG"
- For the purposes of Figma and retrieving designs, the designs are a part of this project: https://www.figma.com/design/049DL3s5yK6CdYuNygmHeX/Broker-App-White-Label
