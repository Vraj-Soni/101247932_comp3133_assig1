const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type Booking {
  _id: ID!
  listing_id: String!
  booking_id: String!
  booking_date: String!
  booking_start: String!
  booking_end: String!
  username:String!
}

type Listing {
  _id: ID!
  listing_id: String!
  listing_title: String!
  description: String!
  street: String!
  city: String!
  postal_code:String!
  price:Float!
  email:String!
  username:String!
}

type User {
  _id: ID!
  username: String!
  firstname: String!
  lastname: String!
  email: String!
  password: String
  type:String!
}

type AuthData {
  _id: ID!
  token: String!
  tokenExpiration: Int!
}

input userInputData {
  username:String!
  firstname:String!
  lastname:String!
  email: String!
  password: String!
  type: String!
}


input listingInputData {
  listing_id: String!
  listing_title: String!
  description: String!
  street: String!
  city: String!
  postal_code:String!
  price:Float!
  email:String!
  username:String!
}


input bookingInputData {
  listing_id: String!
  booking_id: String!
  booking_date: String!
  booking_start: String!
  booking_end: String!
  username:String!
}


type RootQuery {
   login(username: String!, password: String!): AuthData!  
    getUser(id: ID!): User
    listings: [Listing!]!
    getListings: [Listing]!
    getListing(id: ID!): Listing!
    getListingByTitleName(title: String!): [Listing!]!
    getListingByCityName(city: String!): [Listing!]!
    getAllAdminListing: [Listing!]!
    getAdminListing: [Listing!]!
    getAllBookingsByUser: [Booking!]!
}

type RootMutation {
    registerNewUser(userInputData: userInputData): User
    addNewList(listingInputData: listingInputData): Listing
    addNewBooking(bookingInputData: bookingInputData): Booking
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
