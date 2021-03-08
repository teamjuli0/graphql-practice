const express = require('express')
const app = express()
const { graphqlHTTP } = require('express-graphql')
const PORT = 4000
const schema = require('./schema/schema')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.ATLAS_CONNECTION_STRING)

mongoose.connection.once('open', () => {
  console.log('connected to database')
})

// set up graphql middleware under the /graphql url path
app.use(
  '/graphql',
  // get access to graphql over http
  graphqlHTTP({
    // passing in the schema we created under ./schema/schema so that we can use it whenever accessing the path of /graphql
    schema,
    // we are enabling graphiql to be able to make calls on the frontend
    graphiql: true,
  })
)

app.listen(PORT, () => {
  console.log(`Now listening for requests on port ${PORT}`)
})
