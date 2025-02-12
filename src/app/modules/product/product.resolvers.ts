import { Product } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { productServices } from './product.services';

export const productResolvers = {
  Query: {
    // Get all products
    products: catchAsync(async () => {
      const products = await productServices.getAllProductsFromDB();
      return products;
    }),

    //Get a single product
    product: catchAsync(
      async (_parent: any, _args: { id: string }, context: any) => {
        const product = await productServices.getSingleProduct(_args.id);
        return product;
      },
    ),
  },
  Mutation: {
    // Create a new product
    createProduct: catchAsync(async (_parent: any, args: any, context: any) => {
      const newProduct = await productServices.createProduct(context, args);
      return newProduct;
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
