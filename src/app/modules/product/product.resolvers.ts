import { Product } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { productServices } from './product.services';

export const productResolvers = {
  Query: {
    // Get all products
    products: catchAsync(async (_parent, _args, context) => {
      const products = await productServices.getAllProductsFromDB(context);
      return products;
    }),

    //Get a single product
    product: catchAsync(
      async (_parent: any, _args: { id: string }, context: any) => {
        const product = await productServices.getSingleProduct(context,_args.id);
        return product;
      },
    ),

    // Get currently logged in user's products
    myProducts: catchAsync(async (_parent: any, _args: any, context: any) => {
      const products = await productServices.getMyProducts(context);
      return products;
    }),

    // Get currently logged in user's bought products
    boughtProducts: catchAsync(
      async (_parent: any, _args: any, context: any) => {
        const products = await productServices.getBoughtProducts(context);
        return products;
      },
    ),
    // Get currently logged in user's sold products
    soldProducts: catchAsync(async (_parent: any, _args: any, context: any) => {
      const products = await productServices.getSoldProducts(context);
      return products;
    }),

    // Get currently logged in user's borrowed products
    borrowedProducts: catchAsync(
      async (_parent: any, _args: any, context: any) => {
        const products = await productServices.getBorrowedProducts(context);
        return products;
      },
    ),
    // Get currently logged in user's lent products
    lentProducts: catchAsync(async (_parent: any, _args: any, context: any) => {
      const products = await productServices.getLentProducts(context);
      return products;
    }),
  },
  Mutation: {
    // Create a new product
    createProduct: catchAsync(async (_parent: any, args: any, context: any) => {
      const newProduct = await productServices.createProduct(context, args);
      return newProduct;
    }),

    // Rent a product
    rentProduct: catchAsync(async (_, args: any, context: any) => {
      const { id } = args;
      const product = await productServices.rentProduct(context, id, args);
      return product;
    }),

    // Buy a product
    buyProduct: catchAsync(async (_, args: any, context: any) => {
      const { id } = args;
      const product = await productServices.buyProduct(context, id);
      return product;
    }),

    // Update an existing product
    updateProduct: catchAsync(
      async (_parent: any, args: Product, context: any) => {
        const id = args.id;
        const updatedProduct = await productServices.updateProduct(
          context,
          id,
          args,
        );
        return updatedProduct;
      },
    ),

    // Delete a product
    deleteProduct: catchAsync(
      async (_parent: any, args: { id: string }, context: any) => {
        const { id } = args;
        const deleteResult = await productServices.deleteProduct(context, id);
        return deleteResult;
      },
    ),
  },
};
