// GraphQL Schema files have 3 responsibilites
// 1) Define Schema Types (Ex. BookType)
// 2) Define Relationships between types
// 3) Define RootQueries (how a user can jump into a graph and grab data)

// require graphql package
const graphql = require('graphql')

// deconstruct  GraphQL data types from graphql because graphql does not accept vanilla value types such as String or Object
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql

// create new type for schema using the GraphQLObjectType
const BookType = new GraphQLObjectType({
  // give the booktype a name
  name: 'Book',

  // declare the different fields you want available for your type. For schema types, the fields must be a function that returns an object to make sure we have no reference errors whenever connecting multiple schema types
  fields: () => ({
    //for each field, we declare the value type using graphql  data types instead of vanilla data types
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
})

// initiate our rootQuery
const RootQuery = new GraphQLObjectType({
  // give name of 'RootQueryType' name
  name: 'RootQueryType',
  // each of the fields will be a type of root query. Root query doesn't need to be a function because it does not care about order whenever referencing other schema types
  fields: {
    // the name of the field here will directly corilate with the query being called. ex: books{
    //     name
    //     genre
    // }
    book: {
      // type here creates the connection between our query being called (book) and the Schema type we want to reference (BookType)
      type: BookType,
      // args defines the fields being searched through in order to return data from the query being executed. Here, we are saying that we want the book query to reference the BookType and return the contents belonging to the id being passed in as an argument. We also have to specify the data type of whatever args are being passed in.
      // ex query: book(id: '123') {
      //     name
      //     genre
      // }
      args: { id: { type: GraphQLString } },
      // here we write code to get whatever data we need from our database or some other source
      //parents will be relavent when we look at relationships between data
      //args references the args parameter above
      resolve(parents, args) {
        // this is where the query actually happens using the args.id
        args.id
      },
    },
  },
})

module.exports = new graphql.GraphQLSchema({
  //initial RootQuery
  query: RootQuery,
})
