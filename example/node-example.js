const AuroraAPI = require('../build/index');

// User data
const wsUrl = 'ws://localhost:1370/';

// Api usage example
const api = new AuroraAPI();
api.connect(wsUrl)
.then(() => {
    api.sendRequest('ping', {}, (auth) => {
        console.log(auth);
        api.close();
    }, (error) => {
        console.log(error);
        api.close();
    })
})
.catch(console.error);