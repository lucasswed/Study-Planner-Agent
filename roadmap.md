Sprint 0 — Setup & Infraestrutura ✅
Branch: chore/project-setup

Estrutura de pastas
Dockerfiles + docker-compose
FastAPI com GET /health
React boilerplate
.env + .gitignore


Sprint 1 — Auth
Branch: feature/auth
Chores antes:

chore/db-connection — SQLAlchemy + ligação ao PostgreSQL
chore/backend-structure — ficheiros base em auth/ (router, service, repository, models, schemas)

Features:

POST /auth/register
POST /auth/login + geração de JWT
Middleware de proteção de rotas
Frontend: páginas login/signup
Frontend: hook useAuth
Frontend: api layer auth_calls.ts


Sprint 2 — Geração de Plano
Branch: feature/planning
Chores antes:

chore/langchain-setup — LangChain + LLM conectado
chore/planning-structure — ficheiros base em planning/ e agent/

Features:

Prompt de planning no agente
Pydantic schema a validar output do agente
POST /planning/generate
Plano guardado na db
Frontend: página planner.tsx com input de objetivo
Frontend: página my_plans.tsx com checklist


Sprint 3 — Replan
Branch: feature/replan

Frontend envia tarefas completadas
Backend passa contexto ao agente
Agente gera plano ajustado
Frontend atualiza checklist


Sprint 4 — Polish & Deploy
Branches: chore/error-handling, chore/deploy

Tratamento de erros no frontend
Loading states
Testes básicos nas partes críticas
GitHub Actions com CI
Deploy — Railway para backend, Vercel para frontend