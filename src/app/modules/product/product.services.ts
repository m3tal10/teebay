import { Product } from '@prisma/client';
import ApiError from '../../../errors/ApiErrors';
import prisma from '../../../helpers/prisma';

const getAllProductsFromDB = async () => {
  const products = await prisma.product.findMany();
  return products;
};

const getSingleProduct = async (productId: string) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });
  return product;
};

const getMyProducts = async (context: any) => {
  const user = context.user;
  if (!user) {
    throw new ApiError(400, "You're not logged in. Please log in to continue.");
  }
  const newUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      Products: true,
    },
  });
  return newUser.Products;
};

const createProduct = async (context: any, payload: Product) => {
  const user = context.user;
  if (!user) {
    throw new ApiError(
      400,
      'You are not logged in. Please log in to continue.',
    );
  }
  const newProduct = await prisma.product.create({
    data: {
      ...payload,
      ownerId: user.id,
    },
  });
  return newProduct;
};

const updateProduct = async (
  context: any,
  productId: string,
  payload: Product,
) => {
  const user = context.user;
  if (!user) {
    throw new ApiError(400, 'You are not logged in please log in to continue.');
  }
  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: productId,
    },
  });
  if (product.ownerId !== user.id) {
    throw new ApiError(403, 'You are not authorized to update this product.');
  }
  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      ...payload,
    },
  });
  return updatedProduct;
};

const deleteProduct = async (context: any, productId: string) => {
  const user = context.user;
  if (!user) {
    throw new ApiError(400, 'You are not logged in please log in to continue.');
  }
  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: productId,
    },
  });
  if (product.ownerId !== user.id) {
    throw new ApiError(403, 'You are not authorized to update this product.');
  }
  // Deleting the product instead of soft deleting
  const deletedProduct = await prisma.product.delete({
    where: {
      id: productId,
    },
  });
  return deletedProduct;
};

export const productServices = {
  getAllProductsFromDB,
  getMyProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
