# AuroraAPI
[![npm](https://img.shields.io/npm/v/aurora-api?style=flat-square)](https://www.npmjs.com/package/aurora-api)
[![GitHub license](https://img.shields.io/github/license/AuroraTeam/AuroraAPI?style=flat-square)](https://github.com/AuroraTeam/AuroraAPI/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/AuroraTeam/AuroraAPI?style=flat-square)](https://github.com/AuroraTeam/AuroraAPI/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Реализация JS / TS API для [Aurora Launcher](https://github.com/AuroraTeam/Launcher)

## Установка

Используя npm:

```bash
npm i aurora-api
```

Используя jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/aurora-api/dist/aurora-api.min.js"></script>
```

Используя unpkg CDN:

```html
<script src="https://unpkg.com/aurora-api/dist/aurora-api.min.js"></script>
```

## Пример использования (Node.js)

```js
// Подключение класса API
const AuroraAPI = require('aurora-api').default;

// Инициализация класса API
const api = new AuroraAPI();

// Подключение и отправка/обработка запросов с использованием колбеков

api.connect('ws://localhost:1370/', (error) => { // Подключение к сокету лаунчсервера
    if (error) {
        console.error(error);
        api.close(); // Закрытие соединения
        return;
    }
    api.send('ping', (error, result) => { //Запрос к API лаунчер сервера
        if (error) {
            console.error(error);
            api.close();
            return;
        }
        console.log(result);
        api.close();
    });
});

// в стиле Promise

api.connect('ws://localhost:1370/') // Подключение к сокету лаунчсервера
.then(() => {
    api.send('ping').then(result => { //Запрос списка методов авторизации
        console.log(result);
        api.close(); // Закрытие соединения
    }).catch((error) => {
        console.error(error);
        api.close();
    });
}).catch((error) => {
    console.error(error);
    api.close();
});

// или в стиле async/await

(async () => {
    try {
        await api.connect('ws://localhost:1370/');
        const result = await api.send('ping');
        console.log(result);
    } catch (error) {
        console.error(error);
    } finally {
        api.close();
    }
})();
```

Более подробные примеры использования можно найти [здесь](https://github.com/AuroraTeam/AuroraAPI/tree/master/example)

## Методы и параметры

Класс `AuroraAPI` содержит следущее:

Методы:
* `connect(url, callback)` - подключение к сокету лаунчсервера, где:
    * `url` - адрес сокета лаунчсервера
    * `callback` - функция обратного вызова, которая используется для обработки подключения к сокету лаунчер сервара (при написании кода в Promise / async/await стиле не используется)
* `close()` - отключение от сокета лаунчсервера
* `send(type, obj, callback)` - отправка запроса к лаунчсерверу, где:
    * `type` - тип запроса
    * `obj` - объект с параметрами запроса
    * `callback` - функция обратного вызова, которая используется для обработки ответа на запрос (при написании кода в Promise / async/await стиле не используется)
* `close()` - отключение от сокета лаунчсервера
* `hasConnected()` - проверка на наличие подключения к сокету лаунчер серверу

Эвенты (стандартные эвенты [вебсокета](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)):
* `onOpen()` - обработчик эвента [onopen](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onopen)
* `onClose()` - обработчик эвента [onclose](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onclose)
* `onMessage()` - обработчик эвента [onmessage](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onmessage)
* `onError()` - обработчик эвента [onerror](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onerror)