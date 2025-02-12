import { productResolvers } from '../app/modules/product/product.resolvers';
import { userResolvers } from '../app/modules/user/user.resolvers';

const resolvers = [userResolvers, productResolvers];

export default resolvers;
