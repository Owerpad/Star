# ⭐ Звёздочка

**Агрегатор отзывов на видеоигры** — минималистичный сервис для поиска, оценки и обсуждения игр.

![Stack](https://img.shields.io/badge/Backend-Python%20/%20FastAPI-2496ED?style=flat-square)
![Stack](https://img.shields.io/badge/Frontend-React%20/%20Vite-61DAFB?style=flat-square)
![Stack](https://img.shields.io/badge/DB-SQLite-003B57?style=flat-square)
![Stack](https://img.shields.io/badge/Infra-Docker-2496ED?style=flat-square)

---

## Возможности

- **Каталог игр** — обложка, описание, жанр, скриншоты
- **Поиск и фильтры** — по названию, жанру, рейтингу, сортировка
- **Регистрация и вход** — JWT-авторизация
- **Отзывы** — текстовые рецензии с оценкой в звёздах (1–5)
- **Рейтинг** — средняя оценка обновляется автоматически
- **Добавление игр** — вручную или через RAWG API (описание, обложка, скриншоты подтягиваются автоматически)
- **Удаление игр** — авторизованные пользователи могут удалять игры

---

## Стек технологий

| Компонент | Технология |
|-----------|-----------|
| Backend | Python, FastAPI, SQLAlchemy, JWT |
| Frontend | React 18, React Router 6, Axios |
| База данных | SQLite |
| Инфраструктура | Docker, Docker Compose |
| Внешнее API | [RAWG](https://rawg.io) (каталог игр) |

---

## Быстрый старт

### Требования

- Docker и Docker Compose

### Запуск

```bash
docker compose up --build
```

После запуска:

| Сервис | Адрес |
|--------|-------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Документация API | http://localhost:8000/docs |

---

## API

### Авторизация

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/register` | Регистрация нового пользователя |
| POST | `/login` | Вход, получение JWT-токена |

### Игры

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/games` | Список игр (с поиском, фильтрацией, сортировкой) |
| GET | `/games/{id}` | Детальная информация об игре |
| POST | `/games` | Добавление игры (требуется авторизация) |
| DELETE | `/games/{id}` | Удаление игры и всех её отзывов |
| GET | `/games/rawg/search?query=...` | Поиск игры через RAWG |

### Отзывы

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/reviews/{game_id}` | Список отзывов об игре |
| POST | `/reviews` | Добавление отзыва (требуется авторизация) |

### Параметры GET /games

| Параметр | Тип | Описание |
|----------|-----|----------|
| `search` | string | Поиск по названию |
| `genre` | string | Фильтр по жанру |
| `min_rating` | float | Минимальный рейтинг (0–5) |
| `sort` | string | Сортировка: `rating` или `title` |

---

## Структура проекта

```
├── backend/
│   ├── main.py              # Точка входа FastAPI
│   ├── database.py          # Подключение SQLite
│   ├── models.py            # Модели: User, Game, Review
│   ├── schemas.py           # Pydantic-схемы
│   ├── auth.py              # JWT, bcrypt
│   ├── rawg.py              # Интеграция с RAWG API
│   ├── routers/
│   │   ├── auth.py          # POST /register, /login
│   │   ├── games.py         # CRUD игр
│   │   └── reviews.py       # CRUD отзывов
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Навигация, роутинг
│   │   ├── styles.css       # Дизайн-система, тёмная тема
│   │   ├── api/index.js     # Axios-клиент
│   │   ├── components/
│   │   │   └── GameCard.jsx # Карточка игры
│   │   └── pages/
│   │       ├── Home.jsx     # Главная: каталог, поиск, фильтры
│   │       ├── GamePage.jsx # Детальная страница, отзывы
│   │       ├── AddGame.jsx  # Добавление игры
│   │       ├── Login.jsx    # Вход
│   │       └── Register.jsx # Регистрация
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Переменные окружения

| Переменная | Описание |
|-----------|----------|
| `SECRET_KEY` | Ключ для подписи JWT-токенов |
| `RAWG_API_KEY` | API-ключ для RAWG (бесплатный, получить на rawg.io) |

Можно задать в `docker-compose.yml` или файле `backend/.env`.

---

## Дизайн

Тёмная тема с индиго-акцентом (`#6366f1`), вдохновлённая стилем Steam, RAWG и Letterboxd:

- **Фон:** `#0e0e10`
- **Карточки:** `#18181b`
- **Акцент:** `#6366f1`
- **Рейтинг:** золотые звёзды `#f59e0b`
- **Адаптивность:** сетка и детальная страница подстраиваются под экран

---

## Лицензия

MIT
