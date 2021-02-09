const { AuroraAPI } = require('aurora-api');

// User data
const wsUrl = 'ws://localhost:1370/';

// Api usage example
const api = new AuroraAPI();
(async () => {
    try {
        await api.connect(wsUrl);
        const test = await api.send('ping');
        console.log(test);
    } catch (error) {
        console.error(error);
    } finally {
        api.close();
    }
})();