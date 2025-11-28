import { User } from '../user.entity';

// This is the clean data payload the service passes to the repository
export interface IUserCreationPayload {
    username: string;
    role: string;
    passwordHash: string; // The service has already hashed the password
}

export interface IUserRepository {
  create(payload: IUserCreationPayload): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(id: string, updateData: Partial<User>): Promise<User | null>;
  remove(id: string): Promise<void>;
}

// 🔑 This is the token for NestJS Dependency Injection
export const USER_REPOSITORY_TOKEN = 'IUserRepository';