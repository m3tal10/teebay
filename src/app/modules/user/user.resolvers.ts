import { userServices } from './user.services';
import { auth } from '../../middlewares/auth';
import { User } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';

export const userResolvers = {
  Query: {
    //get all users
    users: catchAsync(async () => {
      return await userServices.getAllUsersFromDB();
    }),

    //get user by id
    user: async (_parent: any, args: { id: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return await userServices.getSingleUserFromDB(args.id);
    },

    ///get my profile
    me: async (_parent: any, _args: any, context: any) => {
      const user = await auth(context);
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
      const user = await auth(context);
      const result = await userServices.updateMe(user.id, payload);
      return result;
    },
    //delete user
    deleteUser: async (_parent: any, args: { id: string }) => {
      const result = await userServices.deleteUserFromDB(args.id);
      return result;
    },
  },
};
