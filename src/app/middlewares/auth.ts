import jwt from "jsonwebtoken";
import config from "../../config";
import prisma from "../../helpers/prisma";


export const auth = async (context: any) => {
  // Getting the authorization header from request object
  const authHeader = context.req.headers.authorization;
  if (!authHeader) {
    throw new Error("Authentication token is required");
  }

  // Extracting Bearer token from the header
  const token = authHeader.replace("Bearer ", "");
  try {
    // decoding the JWT
    const decoded: any = jwt.verify(token, config.jwt.jwt_secret as string);

    // finding the user existence in the database based on the decoded token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
};
