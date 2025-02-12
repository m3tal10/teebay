import jwt from 'jsonwebtoken';
import config from '../../config';
import prisma from '../../helpers/prisma';
import { User } from '@prisma/client';
export const auth = async (req: any): Promise<User | null> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, config.jwt.jwt_secret!);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    return user;
  } catch (err) {
    return null;
  }
};
