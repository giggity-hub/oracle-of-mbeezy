const express = require('express');

const app = express();
const sessionProvider = require('./middleware/session')
const routes = require('./routes')
const driver = require('./services/neo4j')

// Middleware
app.use(express.json())
app.use((req, res, next)=>{
    req.driver = driver
    next()
})

// Routes
app.use(routes)

// Start
app.listen(3000, ()=> {
    console.log('listening on Port: 3000')
})