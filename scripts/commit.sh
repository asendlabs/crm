#!/bin/zsh

# Ask if prettier format should be run
read "runPrettier?Do you want to run 'pnpm prettier:format'? (y/n): "

# If the answer is 'y', run prettier
if [[ "$runPrettier" == "y" ]]; then
  pnpm prettier:format
fi

# Step 2: Stage all changes
git add .
cd ..
git add .

# Step 3: Ask for commit message
read "commitMessage?Enter your commit message: "

# Step 4: Commit with the provided message in quotes
git commit -m "$commitMessage"

# Step 5: Push the changes
git push origin main
exit
