# Makefile

.PHONY: process lint lint-fix test help

# Запуск проверки файлов
process:
	yarn process $(path)

# Запуск проверки линтером кода проекта
lint:
	yarn lint

# Автоисправление ошибок линтером в коде проекта
lint-fix:
	yarn lint-fix

# Запуск тестов
test:
	yarn test

# Список доступных команд
help:
	@echo "Доступные команды:"
	@echo "  make process    - Запуск проверки файлов"
	@echo "  make lint       - Запустить проверку линтером кода проекта"
	@echo "  make lint-fix   - Исправить ошибки линтера в коде проекта"
	@echo "  make test       - Запустить тесты"
	@echo "  make help       - Показать эту справку"