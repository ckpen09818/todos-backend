import express from 'express'
import type { Application } from 'express'

import { dbConnection, redisConnection } from './configs/dbConnections'
// router
import router from './routes'

type AppConfig = {
    port: number | string
    middlewares: Array<any>
}

class App {
    private readonly app: Application
    private port: number | string = process.env.PORT

    constructor(config: AppConfig) {
        this.app = express()
        dbConnection()
        redisConnection()
        this.initMiddlewares(config.middlewares)
        this.app.use(router)
    }

    public listen() {
        this.app.listen(this.port, () => console.log(`App running on port ${this.port}`))
    }

    private initMiddlewares(middlewares: Array<any>) {
        middlewares.forEach((middleware) => {
            this.app.use(middleware)
        })
    }
}

export default App
