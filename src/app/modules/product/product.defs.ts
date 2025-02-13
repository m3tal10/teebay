import { gql } from 'apollo-server-express';

export const productDefs = gql`
  enum RentOption {
    DAILY
    WEEKLY
    MONTHLY
  }

  enum ProductCategory {
    ELECTRONICS
    FURNITURE
    HOME_APPLIANCES
    SPORTING_GOODS
    OUTDOOR
    TOYS
  }

  type Product {
    id: ID!
    title: String!
    categories: [ProductCategory!]!
    description: String!
    buyPrice: Float!
    rentPrice: Float!
    rentOption: RentOption!
  }

  type Query {
    products: [Product!]!
    myProducts: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(
      title: String!
      categories: [ProductCategory!]!
      description: String!
      buyPrice: Float!
      rentPrice: Float!
      rentOption: RentOption!
    ): Product!

    updateProduct(
      id: ID!
      title: String
      categories: [ProductCategory!]
      description: String
      buyPrice: Float
      rentPrice: Float
      rentOption: RentOption
    ): Product!

    deleteProduct(id: ID!): Boolean!
  }
`;
