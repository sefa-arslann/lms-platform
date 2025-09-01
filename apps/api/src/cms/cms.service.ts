import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CmsService {
  private readonly logger = new Logger(CmsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Site Settings Management
  async getSiteSettings() {
    try {
      const settings = await this.prisma.siteSetting.findMany({
        orderBy: { key: 'asc' },
      });

      // Convert to key-value object
      const settingsObject: Record<string, any> = {};
      settings.forEach((setting) => {
        settingsObject[setting.key] = setting.value;
      });

      return settingsObject;
    } catch (error) {
      this.logger.error(`Failed to get site settings: ${error.message}`);
      throw error;
    }
  }

  async updateSiteSettings(settings: Record<string, any>) {
    try {
      const updates = Object.entries(settings).map(([key, value]) =>
        this.prisma.siteSetting.upsert({
          where: { key },
          update: { value: value.toString() },
          create: { key, value: value.toString() },
        }),
      );

      await this.prisma.$transaction(updates);
      return this.getSiteSettings();
    } catch (error) {
      this.logger.error(`Failed to update site settings: ${error.message}`);
      throw error;
    }
  }

  // Page Management
  async getPages() {
    try {
      return this.prisma.page.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Failed to get pages: ${error.message}`);
      throw error;
    }
  }

  async getPage(slug: string) {
    try {
      return this.prisma.page.findUnique({
        where: { slug },
      });
    } catch (error) {
      this.logger.error(`Failed to get page: ${error.message}`);
      throw error;
    }
  }

  async createPage(pageData: {
    title: string;
    slug: string;
    content: any;
    metaTitle?: string;
    metaDescription?: string;
    isPublished?: boolean;
  }) {
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
    } catch (error) {
      this.logger.error(`Failed to create page: ${error.message}`);
      throw error;
    }
  }

  async updatePage(slug: string, pageData: {
    title?: string;
    content?: any;
    metaTitle?: string;
    metaDescription?: string;
    isPublished?: boolean;
  }) {
    try {
      return this.prisma.page.update({
        where: { slug },
        data: pageData,
      });
    } catch (error) {
      this.logger.error(`Failed to update page: ${error.message}`);
      throw error;
    }
  }

  async deletePage(slug: string) {
    try {
      return this.prisma.page.delete({
        where: { slug },
      });
    } catch (error) {
      this.logger.error(`Failed to delete page: ${error.message}`);
      throw error;
    }
  }

  // Navigation Management
  async getNavigation() {
    try {
      return this.prisma.navigation.findMany({
        orderBy: { createdAt: 'asc' },
      });
    } catch (error) {
      this.logger.error(`Failed to get navigation: ${error.message}`);
      throw error;
    }
  }

  async createNavigationItem(navData: {
    label: string;
    url?: string;
    pageSlug?: string;
    order: number;
    parentId?: string;
  }) {
    try {
      return this.prisma.navigation.create({
        data: {
          name: navData.label,
          location: 'header',
          items: [],
          isActive: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create navigation item: ${error.message}`);
      throw error;
    }
  }

  async updateNavigationItem(id: string, navData: {
    label?: string;
    url?: string;
    pageSlug?: string;
    order?: number;
    parentId?: string;
  }) {
    try {
      return this.prisma.navigation.update({
        where: { id },
        data: navData,
      });
    } catch (error) {
      this.logger.error(`Failed to update navigation item: ${error.message}`);
      throw error;
    }
  }

  async deleteNavigationItem(id: string) {
    try {
      return this.prisma.navigation.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Failed to delete navigation item: ${error.message}`);
      throw error;
    }
  }

  async reorderNavigation(items: { id: string; order: number }[]) {
    try {
      const updates = items.map((item) =>
        this.prisma.navigation.update({
          where: { id: item.id },
          data: { updatedAt: new Date() },
        }),
      );

      await this.prisma.$transaction(updates);
      return this.getNavigation();
    } catch (error) {
      this.logger.error(`Failed to reorder navigation: ${error.message}`);
      throw error;
    }
  }

  // Block-based Content Management
  async getPageBlocks(pageSlug: string) {
    try {
      const page = await this.prisma.page.findUnique({
        where: { slug: pageSlug },
        select: { content: true },
      });

      if (!page) {
        throw new Error('Page not found');
      }

      return page.content;
    } catch (error) {
      this.logger.error(`Failed to get page blocks: ${error.message}`);
      throw error;
    }
  }

  async updatePageBlocks(pageSlug: string, blocks: any[]) {
    try {
      return this.prisma.page.update({
        where: { slug: pageSlug },
        data: { content: blocks },
      });
    } catch (error) {
      this.logger.error(`Failed to update page blocks: ${error.message}`);
      throw error;
    }
  }

  // Public Site Data
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
    } catch (error) {
      this.logger.error(`Failed to get public site data: ${error.message}`);
      throw error;
    }
  }
}
