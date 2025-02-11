import { gql } from "apollo-server";

export const userDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    address: String
    email: String!
    phone: String
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: String!): User
    me: User
  }

  #   type DeleteResponse {
  #   success: Boolean!
  #   message: String!
  # }

  type Mutation {
    signup(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateProfile(id: ID!, name: String!, email: String!): User
    deleteUser(id: ID!): User
  }
`;
