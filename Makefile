# Makefile

.PHONY: lint lint-fix test help

# Запуск проверки линтером
lint:
	yarn lint

# Автоисправление ошибок линтером
lint-fix:
	yarn lint-fix

# Запуск тестов
test:
	yarn test

# Список доступных команд
help:
	@echo "Доступные команды:"
	@echo "  make lint       - Запустить проверку ESLint"
	@echo "  make lint-fix   - Исправить ошибки, где возможно"
	@echo "  make test       - Запустить тесты"
	@echo "  make help       - Показать эту справку"