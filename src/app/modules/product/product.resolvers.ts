import { Product } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { productServices } from './product.services';

export const productResolvers = {
  Query: {
    // Get all products
    products: catchAsync(async () => {
      const products = await productServices.getAllProductsFromDB();
      if (!products) {
        return {
          success: false,
          statusCode: 404,
          message: 'This product is not available.',
        };
      }
      return {
        success: true,
        statusCode: 200,
        message: 'Products retrieved successfully.',
        data: products,
      };
    }),

    //Get a single product
    product: catchAsync(
      async (_parent: any, _args: { id: string }, context: any) => {
        const product = await productServices.getSingleProduct(_args.id);
        if (!product) {
          return {
            success: false,
            statusCode: 404,
            message: 'This product is not available.',
          };
        }
        return {
          success: true,
          statusCode: 200,
          message: 'Product retrieved successfully.',
          data: product,
        };
      },
    ),

    // Get currently logged in user's products
    myProducts: catchAsync(async (_parent: any, _args: any, context: any) => {
      const products = await productServices.getMyProducts(context);
      return products;
    }),
  },

  // specify single product response
  ProductResponse: {
    __resolveType(obj: any) {
      if (obj.success) {
        return 'ProductSuccessResponse';
      } else if (!obj.success) {
        return 'ProductErrorResponse';
      }
      return null;
    },
  },

  // specify multiple product response
  MultiProductResponse: {
    __resolveType(obj: any) {
      if (obj.success) {
        return 'MultiProductSuccessResponse';
      } else if (!obj.success) {
        return 'ProductErrorResponse';
      }
      return null;
    },
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
