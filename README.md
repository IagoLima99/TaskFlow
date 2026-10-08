# TaskFlow

Gerenciador de tarefas fullstack.

## Stack
- **Front:** Vite + React + TS + Tailwind + Zustand
- **Back:** Fastify + TS + Prisma + Postgres
- **Infra:** Docker Compose

## Pré-requisitos
- Node 20+
- pnpm 9+
- Docker

## Setup
```bash
pnpm install
cp .env.example .env
pnpm db:up      # sobe o Postgres em background
pnpm db:logs    # acompanha os logs (Ctrl+C pra sair)
