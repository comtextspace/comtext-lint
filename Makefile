# Makefile

.PHONY: process lint lint-fix test install help

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

# Сборка и установка расширения в Codium
install: package.json
	@echo "Сборка расширения..."
	@npx @vscode/vsce package
	@echo "Установка расширения в Codium..."
	@VSIX_FILE=$$(ls -t comtext-lint-*.vsix 2>/dev/null | head -1); \
	if [ -z "$$VSIX_FILE" ]; then \
		echo "Ошибка: файл .vsix не найден"; \
		exit 1; \
	fi; \
	codium --install-extension "$$VSIX_FILE" --force
	@echo "Расширение успешно установлено!"

# Список доступных команд
help:
	@echo "Доступные команды:"
	@echo "  make process    - Запуск проверки файлов"
	@echo "  make lint       - Запустить проверку линтером кода проекта"
	@echo "  make lint-fix   - Исправить ошибки линтера в коде проекта"
	@echo "  make test       - Запустить тесты"
	@echo "  make install    - Собрать и установить расширение в Codium"
	@echo "  make help       - Показать эту справку"