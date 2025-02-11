import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import config from "../../../config";
import prisma from "../../../helpers/prisma";

const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    throw new ApiError(404, "User not found");
  }
  return users;
};

const getSingleUserFromDB = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const createUserInDB = async (payload: User) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isExist) {
    throw new ApiError(400, "User already exist");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    { userId: user.id, username: user.name, email: user.email },
    config.jwt.jwt_secret as string
  );
  return { token, user };
};

const loginUserInDB = async (payload: User) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(payload.password, user.password);
  if (!valid) throw new Error("Invalid password");

  const token = jwt.sign(
    { userId: user.id, username: user.name, email: user.email },
    config.jwt.jwt_secret as string
  );
  return { token, user };
};

const updateProfile = async (payload: User) => {
  const user = await prisma.user.update({
    where: { id: payload.id },
    data: {
      name: payload.name,
      email: payload.email,
    },
  });
  return user;
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
};
