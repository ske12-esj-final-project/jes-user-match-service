require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')

const app = express()

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const path = require('path')
const swaggerDocument = YAML.load(path.join(__dirname, '/swagger.yaml'))

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next()
})

const port = process.env.PORT || 8082
const APP_VERSION = '1.0'
const VERSION = process.env.VERSION || '1'

app.use(cors())
app.use(bodyParser.json())
app.use(`/v${VERSION}`, routes)

app.get('/', (req, res) => {
    res.send(`User-Match service is running... VERSION ${APP_VERSION}`)
})

let server = app.listen(port, () => {
    console.log(`jes-user-match-service version: ${APP_VERSION}`)
    console.log('running at http://localhost:' + server.address().port)
})