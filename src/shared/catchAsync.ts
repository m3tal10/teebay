import ApiError from '../errors/ApiErrors';
// High order error catching function to keep the code DRY
const catchAsync = <T, A extends any[]>(
  serviceFunction: (...args: A) => Promise<T>,
) => {
  return async (...args: A): Promise<T> => {
    try {
      return await serviceFunction(...args);
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error.statusCode || 500,
        error.message || 'Something went wrong.',
      );
    }
  };
};

export default catchAsync;
