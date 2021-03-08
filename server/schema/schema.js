// GraphQL Schema files have 3 responsibilites
// 1) Define Schema Types (Ex. BookType)
// 2) Define Relationships between types
// 3) Define RootQueries (how a user can jump into a graph and grab data)

// require graphql package
const graphql = require('graphql')
const _ = require('lodash')
const { Book, Author } = require('../models')

// deconstruct  GraphQL data types from graphql because graphql does not accept vanilla value types such as String or Object
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql

// create new type for object using the GraphQLObjectType
const BookType = new GraphQLObjectType({
  // give the booktype a name
  name: 'Book',

  // declare the different fields you want available for your type. For schema types, the fields must be a function that returns an object to make sure we have no reference errors whenever connecting multiple schema types
  fields: () => ({
    // for each field, we declare the value type using graphql  data types instead of vanilla data types
    // GraphQLID turns any int being passed in as an id into a string to allow us to pass in both strings and ints as ids
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // return _.find(authors, { id: parent.authorid })
      },
    },
  }),
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parents, args) {
        // return _.filter(books, { authorid: parents.id })
      },
    },
  }),
})

// initiate our rootQuery
const RootQuery = new GraphQLObjectType({
  // give name of 'RootQueryType' name
  name: 'RootQueryType',
  // each of the fields will be a type of root query. Root query doesn't need to be a function because it does not care about order whenever referencing other object types
  fields: {
    // the name of the field here will directly corilate with the query being called. ex: books{
    //     name
    //     genre
    // }
    book: {
      // type here creates the connection between our query being called (book) and the object type we want to reference (BookType)
      type: BookType,
      // args defines the fields being searched through in order to return data from the query being executed. Here, we are saying that we want the book query to reference the BookType and return the contents belonging to the id being passed in as an argument. We also have to specify the data type of whatever args are being passed in.
      // ex query: book(id: '123') {
      //     name
      //     genre
      // }
      args: { id: { type: GraphQLID } },
      // here we write code to get whatever data we need from our database or some other source
      //parents will be relavent when we look at relationships between data
      //args references the args parameter above
      resolve(parents, args) {
        // this is where the query actually happens using the args (id in this example). The resolve args will hold the info comming in from the query being executed by the client
        // IMPORTANT
        // CODE FOR ACTUALLY GOING AND COLLECTING THE DATA BEING REQUESTED WILL GO HERE WHETHER IT'S THROUGH SQL NOSQL JSON OR ANY OTHER DATA TYPE. ALTHOUGH WE ARE USING LODASH FOR THIS EXAMPLE, THIS COULD BE DONE WITH ANY TOOL OF CHOICE INCLUDING VANILLA JAVASCRIPT!!!
        return _.find(books, { id: args.id })
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parents, args) {
        // return _.find(authors, { id: args.id })
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parents, args) {
        // return books
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parents, args) {
        // return authors
      },
    },
  },
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        })

        return author.save()
      },
    },
  },
})

// Example Query:
// here we are going into the book field of the RootQuery and, because the args are set to receive an id, we give at an id of '2' to find inside of the BookType
// {
//    book(id: '2'){
//        Whatever properties we have in here will be the properties the schema sends back to the request being made for information. If we were to ommit genre for example all that would be returned from the book with the id of 2 is the name of the book
//        name,
//        genre
//   }
// }

//export the created schema so we can import and use it somewhere else
module.exports = new GraphQLSchema({
  //initial RootQuery
  query: RootQuery,
  mutation: Mutation,
})
