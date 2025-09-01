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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cms_service_1 = require("./cms.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let CmsController = class CmsController {
    cmsService;
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async getPublicSiteData() {
        return this.cmsService.getPublicSiteData();
    }
    async getPublicPage(slug) {
        return this.cmsService.getPage(slug);
    }
    async getSiteSettings() {
        return this.cmsService.getSiteSettings();
    }
    async updateSiteSettings(settings) {
        return this.cmsService.updateSiteSettings(settings);
    }
    async getPages() {
        return this.cmsService.getPages();
    }
    async createPage(pageData) {
        return this.cmsService.createPage(pageData);
    }
    async updatePage(slug, pageData) {
        return this.cmsService.updatePage(slug, pageData);
    }
    async deletePage(slug) {
        return this.cmsService.deletePage(slug);
    }
    async getNavigation() {
        return this.cmsService.getNavigation();
    }
    async createNavigationItem(navData) {
        return this.cmsService.createNavigationItem(navData);
    }
    async updateNavigationItem(id, navData) {
        return this.cmsService.updateNavigationItem(id, navData);
    }
    async deleteNavigationItem(id) {
        return this.cmsService.deleteNavigationItem(id);
    }
    async reorderNavigation(items) {
        return this.cmsService.reorderNavigation(items);
    }
    async getPageBlocks(slug) {
        return this.cmsService.getPageBlocks(slug);
    }
    async updatePageBlocks(slug, blocks) {
        return this.cmsService.updatePageBlocks(slug, blocks);
    }
};
exports.CmsController = CmsController;
__decorate([
    (0, common_1.Get)('public/site-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public site data (no auth required)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Public site data retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getPublicSiteData", null);
__decorate([
    (0, common_1.Get)('public/pages/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public page by slug (no auth required)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Page retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getPublicPage", null);
__decorate([
    (0, common_1.Get)('admin/settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get site settings (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Site settings retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getSiteSettings", null);
__decorate([
    (0, common_1.Put)('admin/settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update site settings (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Site settings updated successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "updateSiteSettings", null);
__decorate([
    (0, common_1.Get)('admin/pages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pages (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pages retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getPages", null);
__decorate([
    (0, common_1.Post)('admin/pages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new page (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Page created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "createPage", null);
__decorate([
    (0, common_1.Put)('admin/pages/:slug'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update page (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Page updated successfully',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "updatePage", null);
__decorate([
    (0, common_1.Delete)('admin/pages/:slug'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete page (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Page deleted successfully',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "deletePage", null);
__decorate([
    (0, common_1.Get)('admin/navigation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get navigation (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Navigation retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getNavigation", null);
__decorate([
    (0, common_1.Post)('admin/navigation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create navigation item (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Navigation item created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "createNavigationItem", null);
__decorate([
    (0, common_1.Put)('admin/navigation/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update navigation item (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Navigation item updated successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "updateNavigationItem", null);
__decorate([
    (0, common_1.Delete)('admin/navigation/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete navigation item (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Navigation item deleted successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "deleteNavigationItem", null);
__decorate([
    (0, common_1.Put)('admin/navigation/reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder navigation items (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Navigation reordered successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "reorderNavigation", null);
__decorate([
    (0, common_1.Get)('admin/pages/:slug/blocks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get page blocks (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Page blocks retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getPageBlocks", null);
__decorate([
    (0, common_1.Put)('admin/pages/:slug/blocks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update page blocks (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Page blocks updated successfully',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "updatePageBlocks", null);
exports.CmsController = CmsController = __decorate([
    (0, swagger_1.ApiTags)('CMS'),
    (0, common_1.Controller)('cms'),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], CmsController);
//# sourceMappingURL=cms.controller.js.map