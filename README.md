# ⭐ Звёздочка

Агрегатор отзывов на видеоигры. Тёмная тема, поиск, фильтры, рейтинг в звёздах, добавление игр через RAWG.

## Быстрый старт

```bash
docker compose up --build
```

| Сервис | Адрес |
|--------|-------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Документация API | http://localhost:8000/docs |

Для работы импорта из RAWG укажите `RAWG_API_KEY` в `docker-compose.yml`.
