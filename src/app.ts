import { ApolloServer } from 'apollo-server';
import typeDefs from './graphql/type.defs';
import resolvers from './graphql/resolvers';
import graphqlErrorHandler from './app/middlewares/graphqlErrorHandler';
import prisma from './helpers/prisma';
import { auth } from './app/middlewares/auth';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: graphqlErrorHandler,
  context: async ({ req, res }) => {
    const user = await auth(req);
    const context = { req, res, prisma, user };
    return context;
  },
});

export default server;
