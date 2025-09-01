import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        database: string;
        version: string;
        error?: undefined;
    } | {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        database: string;
        error: any;
        version: string;
    }>;
    ready(): Promise<{
        status: string;
        timestamp: string;
        database: string;
        error?: undefined;
    } | {
        status: string;
        timestamp: string;
        database: string;
        error: any;
    }>;
}
