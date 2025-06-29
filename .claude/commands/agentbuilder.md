# Agent Builder Command

## Purpose
Create custom AI agents with specific roles, competencies, and protocols. All agent specifications are saved to the `.claude/commands/` directory for easy reuse and organization.

## Usage
When invoked, this command will:
1. Check if `.claude/commands/` directory exists in the working directory
2. Create the directory structure if it doesn't exist
3. Ask the user what type of agent they want to create
4. Gather detailed requirements through intelligent questioning
5. Generate a comprehensive agent specification file
6. Save the file to `.claude/commands/[agent-name].md`

## Process

### Step 1: Agent Discovery
Ask the user:
- What domain/specialty should the agent focus on?
- What specific tasks should it handle?
- What level of expertise is required?
- What output format do they prefer?

### Step 2: Requirements Gathering
Collect information about:
- Primary role and responsibilities
- Core competencies needed
- Engagement protocols
- Expected deliverables
- Quality standards
- Implementation methodology

### Step 3: Agent Creation
Create a structured agent specification file following this format:

```markdown
# [Agent Name] v1.0

## ROLE DEFINITION
[Clear description of the agent's primary function]

## CORE COMPETENCIES
[List of key skills and knowledge areas]

## ENGAGEMENT PROTOCOL
[Step-by-step process for how the agent operates]

## DELIVERABLES
[What the agent produces/outputs]

## QUALITY STANDARDS
[Metrics and benchmarks for success]

## IMPLEMENTATION METHODOLOGY
[How the agent approaches tasks]
```

### Step 4: File Management
- Ensure the `.claude/commands/` directory exists in the current working directory
- If `.claude/` directory doesn't exist, create it
- If `.claude/commands/` directory doesn't exist, create it
- Save the agent specification to `.claude/commands/[agent-name].md`
- Use kebab-case naming (e.g., `frontend-developer.md`, `marketing-specialist.md`)
- Ensure the file is properly formatted and ready for use

## Examples of Agent Types
- **Development Agents**: frontend-developer, backend-architect, fullstack-engineer
- **Business Agents**: marketing-specialist, product-manager, business-analyst  
- **Creative Agents**: content-writer, ui-designer, brand-strategist
- **Technical Agents**: devops-engineer, security-analyst, data-scientist
- **Specialized Agents**: seo-optimizer, conversion-specialist, automation-expert

## Quality Assurance
Each generated agent should:
- Have clear, actionable instructions
- Follow consistent formatting
- Include specific deliverables
- Define quality metrics
- Provide implementation guidance
- Be ready for immediate use

## Directory Structure & File Management
All agent files are created in: `.claude/commands/` relative to the current working directory

### Directory Creation Process:
1. Check if `.claude/` directory exists in current working directory
2. If not, create `.claude/` directory  
3. Check if `.claude/commands/` directory exists
4. If not, create `.claude/commands/` directory
5. Create the agent file as `.claude/commands/[agent-name].md`

This ensures consistency and easy access to all custom agents within the project structure, regardless of the working directory.