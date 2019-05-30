import bodyParser from "body-parser"
import compression from "compression"
import express from "express"
import log4js from "log4js"
import { Builder, Nuxt } from "nuxt"

import config from "../nuxt.config"
import router from "./routes"

// Initialize Logger
const logger = log4js.getLogger()

// Configure Nuxt client
config.dev = !(process.env.NODE_ENV === "production")

// Configure Logger
if (config.dev) {
  logger.level = "DEBUG"
} else {
  logger.level = "INFO"
}

const nuxt = new Nuxt(config)
nuxt.error = (err: Error) => {
  logger.error(`${err.message} error has occurred.`)
  logger.debug(err.stack)
}

// Build Nuxt in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Configure Express server
const app: express.Express = express()

app.use(compression())
app.use(bodyParser.json())

// Add server routing
app.use(router)
app.use(nuxt.render)

// Run the server
const host: string = process.env.HOST || "0.0.0.0"
const port: number = Number(process.env.PORT) || 3000

app.listen(port, host, () => {
  logger.info(`HTTP server listen on http://${host}:${port}`)
})

export default app