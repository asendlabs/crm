#!/bin/zsh
git add .
cd ..
git add .

read "commitMessage?Enter your commit message: "
git commit -m "$commitMessage"

read "runPush?Do you want to push the changes? (y/n): "
if [[ "$runPush" == "y" ]]; then
  git push origin main
fi

exit
