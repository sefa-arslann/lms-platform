import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    check(): unknown;
    ready(): unknown;
}
