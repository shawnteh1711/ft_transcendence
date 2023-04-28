export declare class User {
    id: number;
    username: string;
    boolean: boolean;
    password: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): void;
}
