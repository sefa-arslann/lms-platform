import { UserRole } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    avatar?: string;
    phone?: string;
    bio?: string;
    website?: string;
}
