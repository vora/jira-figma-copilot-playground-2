---
name: start-new-work-item
description: Specifies instructions for starting a new feature, task, or piece of coding work.
---

When the user is starting a new task, proceed according to the following instructions:

1. If the user specifies a JIRA ticket, proceed to the next step. If they don't, prompt the user for a link to the ticket.
2. Make a new branch for the ticket, following the pattern of "/feature/{JIRA ticket number}-{short description}" **VERY IMPORTANT:** For now, all new branches should be spawned from the branch "branch/agentic-coding-demo".
3. Use the Atlassian MCP to read the ticket details
4. If there are Figma links in the associated ticket, use the Figma MCP to pull down both screenshots and code/styling specifications first to understand the design.
5. Once you have all of the details, let the user know how you would like to proceed and confirm with them first that the plan sounds good.
