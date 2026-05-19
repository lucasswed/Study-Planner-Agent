DC ?= docker compose
DC_FILE ?= docker-compose.yml
COMPOSE = $(DC) -f $(DC_FILE)

.PHONY: help build up up-detach down logs ps restart restart-service \
        exec exec-bash run test migrate shell-backend frontend-build

help:
	@echo "Makefile targets:"
	@echo "  build            Build all services"
	@echo "  up               Run compose in foreground"
	@echo "  up-detach        Run compose in background"
	@echo "  down             Stop and remove containers"
	@echo "  logs             Follow service logs"
	@echo "  ps               List containers"
	@echo "  restart          Restart all services"
	@echo "  restart-service  Restart a single service (SERVICE=name)"
	@echo "  exec             Exec into a service (SERVICE=name)"
	@echo "  exec-bash        Exec into a service with bash (SERVICE=name)"
	@echo "  run              Run a one-off command (SERVICE=name CMD='...')"
	@echo "  test             Run tests inside a service (SERVICE=name)"
	@echo "  migrate          Run alembic migrations (assumes service 'backend')"
	@echo "  frontend-build   Install & build frontend (assumes service 'frontend')"

build:
	$(COMPOSE) build --no-cache

up:
	$(COMPOSE) up

up-detach:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down --remove-orphans

logs:
	$(COMPOSE) logs -f --tail=200

ps:
	$(COMPOSE) ps

restart:
	$(COMPOSE) restart

restart-service:
	test -n "$(SERVICE)" || (echo "set SERVICE=name" && exit 1)
	$(COMPOSE) restart $(SERVICE)

exec:
	test -n "$(SERVICE)" || (echo "set SERVICE=name" && exit 1)
	$(COMPOSE) exec $(SERVICE) sh

exec-bash:
	test -n "$(SERVICE)" || (echo "set SERVICE=name" && exit 1)
	$(COMPOSE) exec $(SERVICE) bash

run:
	test -n "$(SERVICE)" || (echo "set SERVICE=name" && exit 1)
	test -n "$(CMD)" || (echo "set CMD='...'" && exit 1)
	$(COMPOSE) run --rm $(SERVICE) sh -c "$(CMD)"

test:
	test -n "$(SERVICE)" || (echo "set SERVICE=backend" && exit 1)
	$(COMPOSE) run --rm $(SERVICE) pytest

test-local:
	cd backend && pytest -v

migrate:
	$(COMPOSE) run --rm backend alembic upgrade head

shell-backend:
	$(COMPOSE) exec backend sh

frontend-build:
	$(COMPOSE) run --rm frontend sh -c "npm install && npm run build"

dev-db:
	$(COMPOSE) up db -d
