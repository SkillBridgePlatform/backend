// src/common/types/express.d.ts
import 'express';
import { User } from 'src/users/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
