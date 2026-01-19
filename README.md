# FlexiCRM

## About

FlexiCRM — это CRM-система, созданная с использованием **Wails**, которая объединяет Go-бэкенд и фронтенд на **React + Vite**.   
В качестве базы данных используется **SQLite**.  

Проект использует Wails для интеграции фронтенда и бэкенда, что позволяет вызывать Go-методы прямо из интерфейса.

## Project Structure

- `frontend/` — фронтенд на Vite (HTML, CSS, JS)
- `internal/` — Go-код бизнес-логики и работы с SQLite
- `wails.json` — конфигурация проекта Wails  

Документацию по настройке проекта можно найти здесь:  
https://wails.io/docs/reference/project-config


Перед запуском проекта убедитесь, что на системе установлены:

- [Go](https://go.dev/doc/install) версии 1.20+  
- [Node.js](https://nodejs.org/) версии 18+  
- [Wails](https://wails.io/docs/gettingstarted/installation)

Установить Wails можно через Go:

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest

## Live Development

Для запуска проекта в режиме разработки с горячей перезагрузкой используйте:

# Запуск проекта
wails dev
