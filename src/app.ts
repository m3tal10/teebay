import { ApolloServer } from "apollo-server";
import typeDefs from "./graphql/type.defs";
import resolvers from "./graphql/resolvers";
import graphqlErrorHandler from "./app/middlewares/graphqlErrorHandler";
import prisma from "./helpers/prisma";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: graphqlErrorHandler,
  context: async ({ req }) => {
    const context = { req, prisma, user: null };
    return context;
  },
});

export default server;
