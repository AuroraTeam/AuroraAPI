// User data
const wsUrl = 'ws://localhost:1370/';

// Log helper
const log = {
    el: document.getElementById('log'),
    append(message) {
        this.el.append(`${message}\n`);
    },
    appendData(data) {
        this.append(JSON.stringify(data));
    }
}

// Api usage example
const api = new AuroraAPI();
api.onOpen = () => {
    log.append('Соединение установлено');
}
api.onClose = (e) => {
    if (e.wasClean) return log.append('Соединение закрыто');
    if (e.code === 1006) log.append('Разрыв соединения');
}
api.onError = () => {
    log.append('Ошибка при подключении!');
}

(async () => {
    try {
        await api.connect(wsUrl);
        const test = await api.send('ping', {});
        log.appendData(test);
    } catch (error) {
        log.appendData(error);
    } finally {
        api.close();
    }
})();