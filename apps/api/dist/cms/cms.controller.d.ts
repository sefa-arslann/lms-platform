import { CmsService } from './cms.service';
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    getPublicSiteData(): unknown;
    getPublicPage(slug: string): unknown;
    getSiteSettings(): unknown;
    updateSiteSettings(settings: Record<string, any>): unknown;
    getPages(): unknown;
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
    getPageBlocks(slug: string): unknown;
    updatePageBlocks(slug: string, blocks: any[]): unknown;
}
