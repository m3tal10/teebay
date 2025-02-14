import { GraphQLError } from 'graphql';
import ApiError from '../../errors/ApiErrors';

const graphqlErrorHandler = (error: GraphQLError) => {
  const originalError = error.originalError as ApiError;
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
