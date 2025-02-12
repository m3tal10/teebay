import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import ApiError from '../../../errors/ApiErrors';
import config from '../../../config';
import prisma from '../../../helpers/prisma';

const getAllProductsFromDB = async () => {
  const products = await prisma.product.findMany();
  return products;
};

export const productServices = {
  getAllProductsFromDB,
};
