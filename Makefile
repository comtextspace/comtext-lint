# Makefile

.PHONY: lint lint-fix help

# Запуск проверки линтером
lint:
	yarn lint

# Автоисправление ошибок линтером
lint-fix:
	yarn lint-fix

# Список доступных команд
help:
	@echo "Доступные команды:"
	@echo "  make lint       - Запустить проверку ESLint"
	@echo "  make lint-fix   - Исправить ошибки, где возможно"
	@echo "  make help       - Показать эту справку"