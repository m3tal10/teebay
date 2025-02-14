import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import AppError from '../../../errors/AppError';
import config from '../../../config';
import prisma from '../../../helpers/prisma';

const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const getSingleUserFromDB = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
};

const createUserInDB = async (payload: User) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isExist) {
    throw new AppError(400, 'User already exist');
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    config.jwt.jwt_secret as string,
  );
  return { token, user };
};

const loginUserInDB = async (payload: User) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) throw new AppError(404, 'User not found');

  const valid = await bcrypt.compare(payload.password, user.password);
  if (!valid) throw new Error('Invalid password');

  const token = jwt.sign(
    { id: user.id, email: user.email },
    config.jwt.jwt_secret as string,
  );
  return { token, user };
};

const updateProfile = async (payload: User) => {
  const user = await prisma.user.update({
    where: { id: payload.id },
    data: {
      ...payload,
    },
  });
  return user;
};

const updateMe = async (context: any, payload: User) => {
  const user = context.user;
  if (!user) {
    throw new AppError(400, "You're not logged in. Please log in to continue.");
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...payload,
    },
  });
  return updatedUser;
};

const deleteUserFromDB = async (userId: string) => {
  const user = await prisma.user.delete({
    where: { id: userId },
  });
  return user;
};

export const userServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  loginUserInDB,
  createUserInDB,
  updateProfile,
  deleteUserFromDB,
  updateMe,
};
