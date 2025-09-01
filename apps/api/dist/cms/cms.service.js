"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CmsService = CmsService_1 = class CmsService {
    prisma;
    logger = new common_1.Logger(CmsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSiteSettings() {
        try {
            const settings = await this.prisma.siteSetting.findMany({
                orderBy: { key: 'asc' },
            });
            const settingsObject = {};
            settings.forEach((setting) => {
                settingsObject[setting.key] = setting.value;
            });
            return settingsObject;
        }
        catch (error) {
            this.logger.error(`Failed to get site settings: ${error.message}`);
            throw error;
        }
    }
    async updateSiteSettings(settings) {
        try {
            const updates = Object.entries(settings).map(([key, value]) => this.prisma.siteSetting.upsert({
                where: { key },
                update: { value: value.toString() },
                create: { key, value: value.toString() },
            }));
            await this.prisma.$transaction(updates);
            return this.getSiteSettings();
        }
        catch (error) {
            this.logger.error(`Failed to update site settings: ${error.message}`);
            throw error;
        }
    }
    async getPages() {
        try {
            return this.prisma.page.findMany({
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            this.logger.error(`Failed to get pages: ${error.message}`);
            throw error;
        }
    }
    async getPage(slug) {
        try {
            return this.prisma.page.findUnique({
                where: { slug },
            });
        }
        catch (error) {
            this.logger.error(`Failed to get page: ${error.message}`);
            throw error;
        }
    }
    async createPage(pageData) {
        try {
            return this.prisma.page.create({
                data: {
                    title: pageData.title,
                    slug: pageData.slug,
                    content: pageData.content,
                    metaTitle: pageData.metaTitle,
                    metaDescription: pageData.metaDescription,
                    isPublished: pageData.isPublished ?? false,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to create page: ${error.message}`);
            throw error;
        }
    }
    async updatePage(slug, pageData) {
        try {
            return this.prisma.page.update({
                where: { slug },
                data: pageData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to update page: ${error.message}`);
            throw error;
        }
    }
    async deletePage(slug) {
        try {
            return this.prisma.page.delete({
                where: { slug },
            });
        }
        catch (error) {
            this.logger.error(`Failed to delete page: ${error.message}`);
            throw error;
        }
    }
    async getNavigation() {
        try {
            return this.prisma.navigation.findMany({
                orderBy: { createdAt: 'asc' },
            });
        }
        catch (error) {
            this.logger.error(`Failed to get navigation: ${error.message}`);
            throw error;
        }
    }
    async createNavigationItem(navData) {
        try {
            return this.prisma.navigation.create({
                data: {
                    name: navData.label,
                    location: 'header',
                    items: [],
                    isActive: true,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to create navigation item: ${error.message}`);
            throw error;
        }
    }
    async updateNavigationItem(id, navData) {
        try {
            return this.prisma.navigation.update({
                where: { id },
                data: navData,
            });
        }
        catch (error) {
            this.logger.error(`Failed to update navigation item: ${error.message}`);
            throw error;
        }
    }
    async deleteNavigationItem(id) {
        try {
            return this.prisma.navigation.delete({
                where: { id },
            });
        }
        catch (error) {
            this.logger.error(`Failed to delete navigation item: ${error.message}`);
            throw error;
        }
    }
    async reorderNavigation(items) {
        try {
            const updates = items.map((item) => this.prisma.navigation.update({
                where: { id: item.id },
                data: { updatedAt: new Date() },
            }));
            await this.prisma.$transaction(updates);
            return this.getNavigation();
        }
        catch (error) {
            this.logger.error(`Failed to reorder navigation: ${error.message}`);
            throw error;
        }
    }
    async getPageBlocks(pageSlug) {
        try {
            const page = await this.prisma.page.findUnique({
                where: { slug: pageSlug },
                select: { content: true },
            });
            if (!page) {
                throw new Error('Page not found');
            }
            return page.content;
        }
        catch (error) {
            this.logger.error(`Failed to get page blocks: ${error.message}`);
            throw error;
        }
    }
    async updatePageBlocks(pageSlug, blocks) {
        try {
            return this.prisma.page.update({
                where: { slug: pageSlug },
                data: { content: blocks },
            });
        }
        catch (error) {
            this.logger.error(`Failed to update page blocks: ${error.message}`);
            throw error;
        }
    }
    async getPublicSiteData() {
        try {
            const [settings, navigation, pages] = await Promise.all([
                this.getSiteSettings(),
                this.getNavigation(),
                this.prisma.page.findMany({
                    where: { isPublished: true },
                    select: {
                        slug: true,
                        title: true,
                        metaTitle: true,
                        metaDescription: true,
                    },
                }),
            ]);
            return {
                settings,
                navigation,
                pages,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get public site data: ${error.message}`);
            throw error;
        }
    }
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = CmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CmsService);
//# sourceMappingURL=cms.service.js.map