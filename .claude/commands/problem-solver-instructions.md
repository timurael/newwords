# Problem-Solver Agent Usage Instructions

## Quick Start

To use the problem-solving agent, simply invoke it with your coding challenge:

```
/agent problem-solver "Fix the authentication bug in the login flow"
/agent problem-solver "Optimize the database queries in the product listing page"
/agent problem-solver "Refactor the payment processing module for better maintainability"
```

## When to Use This Agent

This agent excels at:
- 🐛 **Complex Bug Fixes**: Deep debugging that requires understanding multiple system components
- 🏗️ **Feature Implementation**: Building new features with consideration for the entire system
- ⚡ **Performance Optimization**: Identifying and fixing performance bottlenecks
- 🔧 **Refactoring Projects**: Improving code quality while maintaining functionality
- 🏛️ **Architecture Improvements**: Suggesting and implementing better design patterns
- 🔍 **Code Reviews**: Analyzing code for improvements and potential issues

## Example Prompts

### Bug Fixing
```
/agent problem-solver "Users are experiencing intermittent 500 errors when submitting forms. Debug and fix the root cause."
```

### Feature Development
```
/agent problem-solver "Implement a real-time notification system that integrates with our existing WebSocket infrastructure"
```

### Performance Optimization
```
/agent problem-solver "The dashboard is loading slowly. Profile and optimize the performance, focusing on database queries and frontend rendering."
```

### Refactoring
```
/agent problem-solver "Refactor the user service module to follow SOLID principles and improve testability"
```

### Architecture Review
```
/agent problem-solver "Review our API structure and suggest improvements for better scalability and maintainability"
```

## What Makes This Agent Special

1. **Comprehensive Analysis**: Doesn't just fix the immediate problem but understands the entire context
2. **Proactive Improvements**: Identifies and fixes related issues while solving the main problem
3. **Best Practices**: Applies industry standards while respecting your project's conventions
4. **Future-Proofing**: Creates solutions that anticipate future needs
5. **Quality Focus**: Ensures proper testing, documentation, and code quality

## Integration with Your Workflow

The agent will:
- Use your existing tools and frameworks
- Follow your project's coding standards
- Respect your architectural decisions
- Enhance rather than replace existing code
- Provide clear explanations for all changes

## Tips for Best Results

1. **Be Specific**: The more context you provide, the better the solution
2. **Share Constraints**: Mention any limitations or requirements upfront
3. **Provide Examples**: If you have specific patterns you want followed, share them
4. **Ask for Explanations**: The agent can explain its reasoning and teach you along the way

## Advanced Usage

### Combining with Other Agents
```
/agent problem-solver "Optimize the API endpoints" && /agent tester "Create comprehensive tests for the optimized endpoints"
```

### Iterative Problem Solving
Start with high-level problems and drill down:
```
/agent problem-solver "Improve application performance"
# After analysis...
/agent problem-solver "Optimize the specific database queries identified in the user dashboard"
```

### Learning Mode
Ask the agent to explain its approach:
```
/agent problem-solver "Fix the memory leak in the image processing service and explain the debugging process"
```