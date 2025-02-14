import { userServices } from './user.services';
import { User } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import AppError from '../../../errors/AppError';

export const userResolvers = {
  Query: {
    //get all users
    users: catchAsync(async () => {
      return await userServices.getAllUsersFromDB();
    }),

    //get user by id
    user: async (_parent: any, args: { id: string }, context: any) => {
      if (!context.user) throw new AppError(401, 'Not authenticated');
      return await userServices.getSingleUserFromDB(args.id);
    },

    ///get my profile
    me: async (_parent: any, _args: any, context: any) => {
      const user = context.user;
      if (!user) {
        throw new AppError(
          400,
          "You're not logged in. Please log in to continue.",
        );
      }
      return user;
    },
  },

  Mutation: {
    //signup
    signup: async (_parent: any, payload: User) => {
      const result = await userServices.createUserInDB(payload);
      return result;
    },

    //login user
    login: async (_parent: any, payload: User) => {
      const result = await userServices.loginUserInDB(payload);
      return result;
    },

    //update profile
    updateProfile: async (_parent: any, payload: User) => {
      const result = await userServices.updateProfile(payload);
      return result;
    },
    // update me
    updateMe: async (_parent: any, payload: User, context: any) => {
      const result = await userServices.updateMe(context, payload);
      return result;
    },
    //delete user
    deleteUser: async (_parent: any, args: { id: string }) => {
      const result = await userServices.deleteUserFromDB(args.id);
      return result;
    },
  },
};
