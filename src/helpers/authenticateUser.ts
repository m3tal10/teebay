import { User } from '@prisma/client';
import AppError, { ErrorTypes } from '../errors/AppError';

export default (user: User) => {
  if (!user) {
    throw new AppError(
      ErrorTypes.UNAUTHENTICATED,
      "You're not logged in. Please log in to continue.",
    );
  }
};
