# Проект CRM (FastAPI + Vue/Vite) — README

## Кратко
Этот репозиторий содержит backend на **FastAPI** и два варианта frontend:
- `frontend-fsd` — новая версия, организованная по FSD (feature-sliced design, TypeScript + Vite). В процессе доработки / миграции.
- `frontend-old` — старая рабочая версия интерфейса (без FSD). Используется как reference / быстрый способ поднять UI.

Статус: в разработке. Миграция фронтенда на FSD (feature-sliced design, TypeScript + Vite) частично завершена. В репозитории доступны две версии UI: frontend-fsd (новая, в доработке) и frontend-old (рабочая, без FSD) — используйте frontend-old как reference или для быстрого теста.

---

# 1. Требования
- Python 3.10+  
- Node.js 18+ (или версия, указанная в `package.json`)  
- PostgreSQL (рекомендовано)  
- npm / pnpm / yarn  
- Git

---

# 2. .env.template

# Backend
DATABASE_URL=postgresql://postgres:password@db:5432/crm_db  
SECRET_KEY=change_this_to_a_secure_value  
DEBUG=True  
API_HOST=0.0.0.0  
API_PORT=8000  

# Optional (email, sentry, etc)
SMTP_HOST=  
SMTP_PORT=  
SMTP_USER=  
SMTP_PASSWORD=  

# Frontend dev
VITE_API_URL=http://localhost:8000/api  


### Примеры интерфейса

#### Дашборд (FSD)
![Dashboard — пример](docs/screenshots/dashboard.png)

#### Страница входа
![Login — пример](docs/screenshots/login.png)


# TODO

1. Создать и зафиксировать alembic миграции

2. Подготовить docker-compose.yml для dev (Postgres + backend)

3. Подключить seed-данные для разработки

4. Привести frontend-fsd к сборке (smoke) и проверить login/CRUD

5. Настроить базовый CI (lint → typecheck → tests → build)

6. Доработать и переработать старую версию фронтенда (рефактор, привести в соответствие с API, извлечь ассеты/стили для FSD или архивировать)
