#!/bin/zsh

# Step 1: Run prettier format using pnpm
pnpm prettier:format

# Step 2: Stage all changes
git add .

# Step 3: Ask for commit message
echo "Enter your commit message: "
read commitMessage

# Step 4: Commit with the provided message in quotes
git commit -m '$commitMessage'

# Step 5: Push the changes
git push
