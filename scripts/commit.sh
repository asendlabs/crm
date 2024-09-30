#!/bin/zsh

# Ask if prettier format should be run
echo "Do you want to run 'pnpm prettier:format'? (y/n): "
read runPrettier

# If the answer is 'y', run prettier
if [[ "$runPrettier" == "y" ]]; then
  pnpm prettier:format
fi

# Step 2: Stage all changes
git add .

# Step 3: Ask for commit message
echo "Enter your commit message: "
read commitMessage

# Step 4: Commit with the provided message in quotes
git commit -m "$commitMessage"

# Step 5: Push the changes
git push
