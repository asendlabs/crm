#!/bin/zsh
read "runPrettier?Do you want to run prettier? (y/n): "
if [[ "$runPrettier" == "y" ]]; then
  pnpm prettier:format
fi

git add .
cd ..
git add .

read "commitMessage?Enter your commit message: "
git commit -m "$commitMessage"

read "runPush?Do you want to push the changes? (y/n): "
if [[ "$runPush" == "y" ]]; then
  git push origin main
fi

cd ..

exit
