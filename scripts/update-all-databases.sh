#!/bin/zsh
pnpm drizzle:generate:dev
pnpm drizzle:migrate:dev

pnpm drizzle:generate:prod  
pnpm drizzle:migrate:prod

exit
