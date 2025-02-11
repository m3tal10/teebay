import dotenv from "dotenv";
import path from "path";

// Configured dotenv to read from .env
dotenv.config({ path: path.join(process.cwd(), ".env") });

// 
export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires_in: process.env.JWT_EXPIRES_IN,
    reset_pass_secret: process.env.RESET_PASS_TOKEN,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
    gen_salt: process.env.GEN_SALT,
  },
};
