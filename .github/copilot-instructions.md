# Arquitetura:
frontend/ 
  components/
    header.tsx
    footer.tsx
    etc 
  pages/
    login.tsx
    signup.tsx
    planner.tsx
    my_plans.tsx
    plan_details.tsx
  hooks/
    auth.ts
    localstorage.ts
  api_layer/
    auth_calls.ts
    planning_calls.ts
backend/
  auth/
    router.py
    service.py
    repository.py
  planning/
    router.py
    service.py
    repository.py
  db/
    connect_db.py
  main.py
  agent/
    prompts/
      planing_prompt.py
      replaner_prompt.py
    agent_planner.py

# Stack:
frontend: React + vite 
backend: Fastapi
agentes: langchain
db: postgresql
ci/cd: docker + github actions

# Convenções de código:
cada feature no backend deve separar e ter o seu repository que é o que comunica com a db, o seu service que é o que valida dados, faz transformações e devolve resposta, e o seu proprio router que conté, todas as rotas dessa feature

Deve ter uma cobertura testes de unidade, de integração e e2e

Todas as rotas devem conter autenticação, que deve ser feita através de um bearer token que deve ser obtido através do login. o login é feito usando um username + password. Para criação de conta deve ser usado o username, password e confirmação de password, não podem existir username iguais, na db a password deve estar hashed usando o bcrypt.

O agente é uma library interna que o service do planning importa diretamente.

O router não deve fazer qualquer tipo de validação além do redirecionamento para o respectivo service 

Para cada feature nova deve ser criada uma nova branch usando as convenções do tipo feat/* fix/* chore/* 

Todas as informações sensiveis e de segurança devem estar no .env que por sua vez deve estar no gitignore

# Design System

## Stack de Frontend
- React + Vite + TypeScript
- shadcn/ui (Radix) — componentes
- Tailwind CSS v4 — styling
- Framer Motion — animações
- react-i18next — internacionalização (pt/en)
- React Router — routing

## Cores
- Primária light: cyan-600 (#0891b2)
- Primária hover: cyan-700 (#0e7490)
- Primária dark: cyan-400 (#22d3ee)
- Background light: white (#ffffff) / gray-50 (#f9fafb)
- Background dark: gray-950 (#030712) / gray-900 (#111827)
- Text light: gray-900 (#111827)
- Text dark: gray-50 (#f9fafb)
- Text secundário light: gray-500 (#6b7280)
- Text secundário dark: gray-400 (#9ca3af)
- Erro: red-500 (#ef4444)
- Sucesso: green-500 (#22c55e)

## Tipografia
- Font: Inter
- Border radius: rounded-xl (12px)
- Sombras: shadow-sm em light, mínimas em dark

## Animações
- Micro-interações: 200ms ease-in-out
- Transições de página: 300ms ease-in-out

## Regras de Componentes
- Usar sempre componentes shadcn/ui quando disponíveis
- Suporta light e dark mode obrigatoriamente
- Dois idiomas: português (pt) e inglês (en)
- Nunca usar preto/branco puro
- Animações com Framer Motion
- Textos sempre via i18next — nunca hardcoded