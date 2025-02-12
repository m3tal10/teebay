import { gql } from 'apollo-server';

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

  type Mutation {
    signup(
      firstName: String!
      lastName: String!
      address: String
      email: String!
      phone: String
      password: String!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateMe(
      firstName: String
      lastName: String
      address: String
      email: String
      phone: String
    ): User
    updateProfile(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): User
  }
`;
