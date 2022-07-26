import path from 'path'
import { config } from 'dotenv'
config({ path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`) })

import App from './app'

// middlewares
import { json, urlencoded } from 'express'
import cors from 'cors'
import morgan from 'morgan'

const app = new App({
    port: process.env.PORT,
    middlewares: [json(), urlencoded({ extended: true }), cors(), morgan('combined')],
})

app.listen()
