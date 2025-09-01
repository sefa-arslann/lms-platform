import { PrismaService } from '../prisma/prisma.service';
export declare class CmsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getSiteSettings(): Promise<Record<string, any>>;
    updateSiteSettings(settings: Record<string, any>): Promise<Record<string, any>>;
    getPages(): Promise<{
        id: string;
        title: string;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        metaTitle: string | null;
        metaDescription: string | null;
        publishedAt: Date | null;
    }[]>;
    getPage(slug: string): Promise<{
        id: string;
        title: string;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        metaTitle: string | null;
        metaDescription: string | null;
        publishedAt: Date | null;
    } | null>;
    createPage(pageData: {
        title: string;
        slug: string;
        content: any;
        metaTitle?: string;
        metaDescription?: string;
        isPublished?: boolean;
    }): Promise<{
        id: string;
        title: string;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        metaTitle: string | null;
        metaDescription: string | null;
        publishedAt: Date | null;
    }>;
    updatePage(slug: string, pageData: {
        title?: string;
        content?: any;
        metaTitle?: string;
        metaDescription?: string;
        isPublished?: boolean;
    }): Promise<{
        id: string;
        title: string;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        metaTitle: string | null;
        metaDescription: string | null;
        publishedAt: Date | null;
    }>;
    deletePage(slug: string): Promise<{
        id: string;
        title: string;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        metaTitle: string | null;
        metaDescription: string | null;
        publishedAt: Date | null;
    }>;
    getNavigation(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }[]>;
    createNavigationItem(navData: {
        label: string;
        url?: string;
        pageSlug?: string;
        order: number;
        parentId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    updateNavigationItem(id: string, navData: {
        label?: string;
        url?: string;
        pageSlug?: string;
        order?: number;
        parentId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    deleteNavigationItem(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    reorderNavigation(items: {
        id: string;
        order: number;
    }[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }[]>;
    getPageBlocks(pageSlug: string): Promise<import("@prisma/client/runtime/library").JsonValue>;
    updatePageBlocks(pageSlug: string, blocks: any[]): Promise<{
        id: string;
        title: string;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        metaTitle: string | null;
        metaDescription: string | null;
        publishedAt: Date | null;
    }>;
    getPublicSiteData(): Promise<{
        settings: Record<string, any>;
        navigation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            location: string;
            items: import("@prisma/client/runtime/library").JsonValue;
            isActive: boolean;
        }[];
        pages: {
            title: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
        }[];
    }>;
}
