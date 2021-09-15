const { AuroraAPI } = require("../dist/aurora-api.node")

// User data
const wsUrl = "ws://localhost:1370/ws"

// Api usage example
const api = new AuroraAPI(wsUrl)
;(async () => {
    try {
        await api.ready()
        const test = await api.send("ping")
        console.log(test)
    } catch (error) {
        console.error(error)
    } finally {
        api.close()
    }
})()
