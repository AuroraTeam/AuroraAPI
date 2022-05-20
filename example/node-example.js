const { AuroraAPISocket } = require("../dist/aurora-api-node.cjs")

// User data
const wsUrl = "ws://localhost:1370/ws"

// Api usage example
;(async () => {
    let api
    try {
        api = new AuroraAPISocket(wsUrl)
        await api.ready()
        const test = await api.send("servers")
        console.log(test)
    } catch (error) {
        console.error(error)
    } finally {
        api.close()
    }
})()
