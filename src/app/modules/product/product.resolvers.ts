import catchAsync from '../../../shared/catchAsync';
import { productServices } from './product.services';

export const productResolvers = {
  Query: {
    products: catchAsync(async () => {
      const products = await productServices.getAllProductsFromDB();
      return products;
    }),
  },
};
