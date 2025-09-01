import { CmsService } from './cms.service';
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
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
    getPublicPage(slug: string): Promise<{
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
    getPageBlocks(slug: string): Promise<import("@prisma/client/runtime/library").JsonValue>;
    updatePageBlocks(slug: string, blocks: any[]): Promise<{
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
}
