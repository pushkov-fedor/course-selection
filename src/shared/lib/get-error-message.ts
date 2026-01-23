// src/shared/lib/get-error-message.ts

import { ApiError } from "@/shared/api/client";

/**
 * Извлекает понятное сообщение об ошибке из любого типа ошибки
 */
export function getErrorMessage(error: unknown, fallback = "Произошла ошибка"): string {
  if (error instanceof ApiError) {
    // Если есть сообщение от бэкенда — используем его
    if (error.message && error.message !== `Request failed with status ${error.status}`) {
      return error.message;
    }
    // Иначе генерируем на основе статуса
    switch (error.status) {
      case 400:
        return "Некорректные данные. Проверьте заполненные поля.";
      case 401:
        return "Требуется авторизация.";
      case 403:
        return "Нет прав для выполнения действия.";
      case 404:
        return "Запрашиваемый ресурс не найден.";
      case 409:
        return "Конфликт данных. Возможно, такая запись уже существует.";
      case 500:
        return "Ошибка сервера. Попробуйте позже.";
      default:
        return fallback;
    }
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
}

