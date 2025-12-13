
# Frontend-часть приложения для отслеживания загруженности аудиторий

## Предусловия

### 1. Создание Docker сети (если еще не создана)
```bash
docker network create tyk-network
```
**Примечание:** Если сеть уже существует, команда выдаст предупреждение, но это не критично.

### 2. Проверка доступности Backend API
Убедитесь, что Backend Service запущен и доступен:
- Либо через Tyk API Gateway (если используется)
- Либо напрямую по адресу, указанному в конфигурации

**Важно:** В production-режиме (Docker) dev-прокси из `quasar.config.js` не работает. 
Если нужно проксировать запросы через Nginx, настройте соответствующий `location` в `nginx/nginx.conf`.

## Запуск

### Первый запуск или после изменений в коде:
```bash
docker-compose up --build
```

### Обычный запуск:
```bash
docker-compose up -d
```

## Просмотр логов
```bash
docker-compose logs -f frontend-service
```

## Остановка
```bash
docker-compose down
```

## Проверка статуса
```bash
docker-compose ps
```

## Устранение неполадок

### Приложение не открывается
- Проверьте, что порт 80 не занят другим приложением
- Проверьте логи: `docker-compose logs frontend-service`
- Убедитесь, что контейнер запущен: `docker-compose ps`

### API запросы не работают
- Убедитесь, что Backend Service запущен и доступен
- Проверьте настройки сети `tyk-network`: `docker network inspect tyk-network`
- Проверьте конфигурацию Nginx (если используется проксирование)
- Откройте консоль браузера (F12) для просмотра ошибок CORS или сетевых ошибок

### Проблемы со сборкой
- Убедитесь, что Node.js зависимости установлены корректно
- Проверьте логи сборки: `docker-compose build --no-cache`
- Убедитесь, что файл `main/package.json` существует и корректен

## Локальная разработка

Для локальной разработки (без Docker):
```bash
cd main
npm install
npm run dev
```

## Разработчики

Садковская Маргарита, Милованова Анастасия, Пивоварова Милена

## Ссылки

Backend-часть -- https://github.com/FernFloss/webBackend
ML-часть -- https://github.com/FernFloss/webML
