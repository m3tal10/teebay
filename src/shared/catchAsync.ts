import AppError from '../errors/AppError';
// High order error catching function to keep the code DRY
const catchAsync = <T, A extends any[]>(
  serviceFunction: (...args: A) => Promise<T>,
) => {
  return async (...args: A): Promise<T> => {
    try {
      return await serviceFunction(...args);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error.statusCode || 500,
        error.message || 'Something went wrong.',
      );
    }
  };
};

export default catchAsync;
