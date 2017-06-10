#!/usr/bin/env bash
set -e

if [[ $(git symbolic-ref --short HEAD) != 'master' ]]; then
  git branch -D master
  git checkout -b master
fi
git remote rename origin skeleton
git remote add origin $(node -p 'require("./package").repository.url')
git branch --set-upstream master origin/master
rm complete.sh
git add --all .
git commit -n -m 'pollinate project'

