import { GraphQLError } from 'graphql';
import ApiError from '../../errors/ApiErrors';

const graphqlErrorHandler = (error: GraphQLError) => {
  const originalError = error.originalError as ApiError;

  // Default error response
  const formattedError = new GraphQLError(error.message, {
    extensions: {
      code: originalError?.name || 'INTERNAL_SERVER_ERROR',
      stack: error.stack ? error.stack.split('\n') : [],
      statusCode: originalError?.statusCode || 500,
      path: error.path,
      position: error.locations,
    },
  });

  return formattedError;
};

export default graphqlErrorHandler;
