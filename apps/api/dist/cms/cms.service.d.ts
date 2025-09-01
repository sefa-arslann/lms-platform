import { PrismaService } from '../prisma/prisma.service';
export declare class CmsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getSiteSettings(): unknown;
    updateSiteSettings(settings: Record<string, any>): unknown;
    getPages(): unknown;
    getPage(slug: string): unknown;
    createPage(pageData: {
        title: string;
        slug: string;
        content: any;
        metaTitle?: string;
        metaDescription?: string;
        isPublished?: boolean;
    }): unknown;
    updatePage(slug: string, pageData: {
        title?: string;
        content?: any;
        metaTitle?: string;
        metaDescription?: string;
        isPublished?: boolean;
    }): unknown;
    deletePage(slug: string): unknown;
    getNavigation(): unknown;
    createNavigationItem(navData: {
        label: string;
        url?: string;
        pageSlug?: string;
        order: number;
        parentId?: string;
    }): unknown;
    updateNavigationItem(id: string, navData: {
        label?: string;
        url?: string;
        pageSlug?: string;
        order?: number;
        parentId?: string;
    }): unknown;
    deleteNavigationItem(id: string): unknown;
    reorderNavigation(items: {
        id: string;
        order: number;
    }[]): unknown;
    getPageBlocks(pageSlug: string): unknown;
    updatePageBlocks(pageSlug: string, blocks: any[]): unknown;
    getPublicSiteData(): unknown;
}
