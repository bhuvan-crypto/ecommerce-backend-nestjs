import { Role } from '../../types/user';
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      role: Role;
    }
  }
}
export {};
