import { gql } from 'apollo-server-express';

export const productDefs = gql`
  union ProductResponse = ProductErrorResponse | ProductSuccessResponse
  union MultiProductResponse =
    | ProductErrorResponse
    | MultiProductSuccessResponse

  interface IProductResponse {
    success: Boolean!
    statusCode: Int!
    message: String!
  }

  # Error Response
  type ProductErrorResponse implements IProductResponse {
    success: Boolean!
    statusCode: Int!
    message: String!
  }

  # Success Response
  type ProductSuccessResponse implements IProductResponse {
    success: Boolean!
    statusCode: Int!
    message: String!
    data: Product!
  }

  type MultiProductSuccessResponse implements IProductResponse {
    success: Boolean!
    statusCode: Int!
    message: String!
    data: [Product!]!
  }

  # regular types
  type Product {
    id: ID!
    title: String!
    categories: [ProductCategory!]!
    description: String!
    buyPrice: Float!
    rentPrice: Float!
    rentOption: RentOption!
  }

  # Queries
  type Query {
    products: MultiProductResponse!
    myProducts: MultiProductResponse!
    product(id: ID!): ProductResponse!
  }

  # Mutations
  type Mutation {
    createProduct(
      title: String!
      categories: [ProductCategory!]!
      description: String!
      buyPrice: Float!
      rentPrice: Float!
      rentOption: RentOption!
    ): ProductResponse!

    updateProduct(
      id: ID!
      title: String
      categories: [ProductCategory!]
      description: String
      buyPrice: Float
      rentPrice: Float
      rentOption: RentOption
    ): ProductResponse!

    deleteProduct(id: ID!): Boolean!
  }

  # Enums
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
`;
