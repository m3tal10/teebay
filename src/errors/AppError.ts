export const ErrorTypes = {
  BAD_REQUEST: {
    errorCode: 'BAD_USER_INPUT',
    errorStatus: 400,
  },
  NOT_FOUND: {
    errorCode: 'NOT_FOUND',
    errorStatus: 404,
  },
  UNAUTHENTICATED: {
    errorCode: 'UNAUTHENTICATED',
    errorStatus: 401,
  },
  FORBIDDEN: {
    errorCode: 'FORBIDDEN',
    errorStatus: 403,
  },
};

class AppError extends Error {
  errorType: any;
  constructor(errorType: any, message: string | undefined, stack = '') {
    super(message);
    this.errorType = errorType;
    this.message = message || 'Something went wrong. Please try again.';
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
