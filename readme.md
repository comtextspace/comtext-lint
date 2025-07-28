# Comtext-lint

Консольная утилита для проверки формата [Comtext](https://research.comtext.space/format-comtext.html).

## Установка

```
yarn install
```

## Запуск

```
yarn process [path]
```

Вместо `[path]` может быть путь к файлу или каталогу. Утилита проверит файл или файлы в каталоге с расширениями `.md` и `.ct`.

## Пакты

Для проверок используются пакеты

* [remark-lint](https://github.com/remarkjs/remark-lint)
* [remark-gfm](https://github.com/remarkjs/remark-gfm)

Дополнительно

* [AST Explorer](https://astexplorer.net)
* [awesome remark](https://github.com/remarkjs/awesome-remark)