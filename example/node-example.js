const AuroraApi = require('../src');

// User data
const wsUrl = 'ws://localhost:1370/';

// Api usage example
const api = new AuroraApi();
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