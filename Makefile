# Makefile

.PHONY: process lint lint-fix test install release help

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

# Создание нового релиза: обновляет версию, коммитит, тегирует и пушит
release:
	@CURRENT=$$(node -p "require('./package.json').version"); \
	echo "Текущая версия: $$CURRENT"; \
	read -p "Новая версия: " VERSION; \
	[ "$$VERSION" ] || (echo "Версия не указана" && exit 1); \
	node -e "const p=JSON.parse(require('fs').readFileSync('package.json','utf8')); \
		p.version='$$VERSION'; \
		require('fs').writeFileSync('package.json', JSON.stringify(p,null,2)+'\n')"; \
	yarn install; \
	git add package.json yarn.lock; \
	git commit -m "release v$$VERSION"; \
	git tag v$$VERSION; \
	git push && git push --tags; \
	echo "Тег v$$VERSION отправлен — CI запустит сборку и публикацию"

# Список доступных команд
help:
	@echo "Доступные команды:"
	@echo "  make process    - Запуск проверки файлов"
	@echo "  make lint       - Запустить проверку линтером кода проекта"
	@echo "  make lint-fix   - Исправить ошибки линтера в коде проекта"
	@echo "  make test       - Запустить тесты"
	@echo "  make install    - Собрать и установить расширение в Codium"
	@echo "  make release    - Создать новый релиз (обновить версию, тег, push)"
	@echo "  make help       - Показать эту справку"