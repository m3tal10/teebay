import { GraphQLError } from 'graphql';
import AppError from '../../errors/AppError';

const graphqlErrorHandler = (error: GraphQLError) => {
  const originalError = error.originalError as AppError;
  console.error(originalError);
  // Default error response
  const formattedError = new GraphQLError(error.message, {
    extensions: {
      code: originalError?.errorType.errorCode || 'INTERNAL_SERVER_ERROR',
      http: {
        status: originalError.errorType.errorStatus,
      },
    },
  });

  return formattedError;
};

export default graphqlErrorHandler;
