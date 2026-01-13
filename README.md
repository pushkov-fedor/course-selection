# Course Selection Platform

Платформа для записи на курсы в университете.

## Технологии

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** компоненты

## Разработка

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000) в браузере.

## Деплой на GitHub Pages

Проект настроен для автоматического деплоя на GitHub Pages через GitHub Actions.

### Настройка

1. **Включи GitHub Pages в настройках репозитория:**
   - Перейди в `Settings` → `Pages`
   - В разделе `Source` выбери `GitHub Actions`

2. **Пуш изменений:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages"
   git push
   ```

3. **Проверь деплой:**
   - Перейди в `Actions` в репозитории
   - Дождись завершения workflow `Deploy to GitHub Pages`
   - Сайт будет доступен по адресу: `https://pushkov-fedor.github.io/course-selection/`

### Если репозиторий не в корне

Если проект находится в подпапке (например, `frontend/`), раскомментируй в `next.config.ts`:

```typescript
basePath: "/course-selection",
assetPrefix: "/course-selection",
```

И замени `course-selection` на имя твоего репозитория.

## Структура проекта

- `/src/app` - страницы Next.js
- `/src/components` - React компоненты
- `/src/lib` - утилиты и mock-данные
- `/src/types` - TypeScript типы
