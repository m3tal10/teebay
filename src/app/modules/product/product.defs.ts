import { gql } from 'apollo-server-express';

export const productDefs = gql`
  enum RentOption {
    DAILY
    WEEKLY
    MONTHLY
  }

  enum ProductStatus {
    AVAILABLE
    LENT
    SOLD
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
    status: ProductStatus!
    rentOption: RentOption!
    viewCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type RentProducts {
    id: ID!
    product: Product!
    renter: User!
    startTime: String!
    endTime: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    products: [Product!]!
    myProducts: [Product!]!
    product(id: ID!): Product
    boughtProducts: [Product!]!
    soldProducts: [Product!]!
    borrowedProducts: [RentProducts!]!
    lentProducts: [RentProducts!]!
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

    rentProduct(id: ID!, startTime: String!, endTime: String!): Product!

    buyProduct(id: ID!): Product!

    deleteProduct(id: ID!): Boolean!
  }
`;
