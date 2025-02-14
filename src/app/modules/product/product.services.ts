import { Product, ProductRent } from '@prisma/client';
import AppError, { ErrorTypes } from '../../../errors/AppError';
import prisma from '../../../helpers/prisma';
import authenticateUser from '../../../helpers/authenticateUser';

const getAllProductsFromDB = async (context: any) => {
  const user = context.user;
  authenticateUser(user);
  const products = await prisma.product.findMany({
    where: {
      ownerId: {
        not: user.id,
      },
    },
  });
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
  // helper function to authenticate user or throw error...

  authenticateUser(user);
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

// Get currently logged in user's bought products

const getBoughtProducts = async (context: any) => {
  const user = context.user;
  authenticateUser(user);
  const boughtProducts = await prisma.productBuy.findMany({
    where: {
      buyerId: user.id,
    },
    select: {
      product: true,
    },
  });
  return boughtProducts.map(pb => pb.product);
};

// Rent product
const rentProduct = async (
  context: any,
  productId: string,
  payload: ProductRent,
) => {
  const user = context.user;
  const rentStartTime = new Date(payload.startTime);
  const rentEndTime = new Date(payload.endTime);
  authenticateUser(user);
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });
  if (!product) {
    throw new AppError(
      ErrorTypes.NOT_FOUND,
      ' This product is not available anymore.',
    );
  }
  // Checking if the product is already up for rent at the specified time.
  const existingRental = await prisma.productRent.findFirst({
    where: {
      productId: productId,
      AND: [
        { startTime: { lte: rentEndTime } },
        { endTime: { gte: rentStartTime } },
      ],
    },
  });
  if (existingRental) {
    throw new AppError(
      ErrorTypes.BAD_REQUEST,
      'The product is up for rental at the given time. Please choose another time.',
    );
  }
  const productRent = await prisma.productRent.create({
    data: {
      renterId: user.id,
      productId: productId,
      startTime: rentStartTime,
      endTime: rentEndTime,
    },
  });

  return product;
};

// Buy product
const buyProduct = async (context: any, productId: string) => {
  const user = context.user;
  // helper function to authenticate user or throw error...
  authenticateUser(user);
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });
  if (!product) {
    throw new AppError(
      ErrorTypes.NOT_FOUND,
      ' This product is not available anymore.',
    );
  }
  if (product.status !== 'AVAILABLE') {
    throw new AppError(
      ErrorTypes.BAD_REQUEST,
      'This product is not available for sell anymore.',
    );
  }
  const productOnRent = await prisma.productRent.findFirst({
    where: {
      endTime: {
        gt: new Date(Date.now()),
      },
    },
  });
  if (productOnRent) {
    throw new AppError(
      ErrorTypes.BAD_REQUEST,
      'A rent is scheduled on this product. You cannot buy this product now.',
    );
  }
  await prisma.$transaction(async prisma => {
    await prisma.productBuy.create({
      data: {
        productId,
        buyerId: user.id,
      },
    });
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        status: 'SOLD',
      },
    });
    return;
  });
  return product;
};
const createProduct = async (context: any, payload: Product) => {
  const user = context.user;
  // helper function to authenticate user or throw error...

  authenticateUser(user);
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
  authenticateUser(user);
  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: productId,
    },
  });
  if (product.ownerId !== user.id) {
    throw new AppError(
      ErrorTypes.FORBIDDEN,
      'You are not authorized to update this product.',
    );
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
  // helper function to authenticate user or throw error...
  authenticateUser(user);
  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: productId,
    },
  });
  if (product.ownerId !== user.id) {
    throw new AppError(
      ErrorTypes.FORBIDDEN,
      'You are not authorized to update this product.',
    );
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
  getBoughtProducts,
  rentProduct,
  buyProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
