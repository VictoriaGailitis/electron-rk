# RKSoft - приложение для "Ретроспективы квестов. Бинго"
![image](https://github.com/user-attachments/assets/3c2d8397-96f5-4287-9529-42641f4925d1)
"Ретроспектива квестов" - ивент стримера [Zhem] (https://www.twitch.tv/zhem) по прохождению игр в жанре квест. Главная цель ивента - зачеркнуть все клетки на поле бинго, каждая из которых представляет собой тему. Клетки зачеркиваются прохождением игр соответсвующего жанра.
## Функционал и механики (тех.задание)
1. Десктопное приложение с локальной базой данных и локальным сервером
2. Настраиваемый размер поля
3. Клетка имеет три агрегатных состояния: скрытая (не видно, что там за тема и цвет клетки), открытая (видно тему и цвет), вычеркнутая (то есть пункт выполнен)
4. Настройка количества открытых и закрытых клеток на поле в начале тура
5. Каждой клетке на поле соответствует тема из общего пула, темы не должны повторяться. То есть на поле не должно быть одновременно одинаковых тем ни в открытую, ни в закрытую, с учетом вычеркнутых
6. Состояние любой клетки можно во время прохождения ивента менять, не только открыть закрытую и вычеркнуть выполненную, но и сделать ее снова невычеркнутой или закрытой
7. Клетки делятся на белые и золотые. Когда клетка открыта, цвет видно, когда скрыта – не видно. Перед началом тура должно быть можно настроить количество белых и золотых клеток
8. В начале тура, когда генерируется поле, все темы рандомятся из общего пула, и открытые, и закрытые. Также рандомится расположение открытых и закрытых клеток, белых и золотых клеток
9. Если открытая клетка скрывается снова, тема в ней должна рандомиться на другую из общего пула тем, с учетом, что на поле не должно быть повторов. Тема, которая при этом удаляется, возвращается в общий пул и может снова выпасть потом, если снова будет замена темы какой-либо клетки.
10. Система бэкапов базы данных
11. Система взаимодействия с клетками на поле: окрытие меню при нажатии на клетку с возожностью поменять цвет, зачекрунть/вычеркнуть клетку, открыть/закрыть. Необратимые действия (открыть, закрыть) – через окно с подтверждением, те, которые можно исправить без ущерба для игрового процесса (перекрасить, вычеркнуть) – без подтверждения.
12. Редактура списка тем (единым списком в текстовом окне и по одной в соответсвующей форме)
13. Рандом темы на клетке с учетом требования уникальности всех тем на поле
14. Рандомайзер клеток (подсвечивается выбранная клетка): из всех на поле; из всех открытых; всех закрытых; всех открытых золотых/белых; всех зачеркнутых
15. Система заметок для каждой клетки (ввод в меню взаимодействия с клеткой, отображение в popup-облаке при наведении курсора на клетку)
16. Трекинг задействованных в ивенте игр (ввод названия игры и выбор статуса "пройденно / не пройдено")
## Ссылки
[Логи ивента] (https://docs.google.com/spreadsheets/d/1wqiYwX-KX_wmAPeGiWPbmuu5ocGMjj1lNZJVhDEW8F4/edit?clckid=46a9038d&gid=214069011#gid=214069011)
## Зависимости
### devDependencies:
1. "electron": "^29.0.1",
2. "electron-packager": "^17.1.2",
3. "nodemon": "^3.1.0"
### dependencies:
1. "cron": "^3.1.7",
2. "express": "^4.19.1",
3. "fs-extra": "^11.2.0",
4. "hbs": "^4.2.0",
5. "nedb": "^1.8.0"
## Структура проекта
1. views - папка с представлениями handlebars
2. public - статика (js/images/fonts/css)
3. db - файлы локальной документоориентированной базы данных
4. backups - файл бэкапов базы данных
5. main.js - файл запуска electron процессов
6. server.js - файл запуска сервера express
