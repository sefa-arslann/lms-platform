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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = exports.DeviceInfoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class DeviceInfoDto {
    platform;
    model;
    ip;
    userAgent;
    installId;
}
exports.DeviceInfoDto = DeviceInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device platform',
        example: 'MacIntel',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeviceInfoDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device model',
        example: 'Mac',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeviceInfoDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device IP address',
        example: '127.0.0.1',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeviceInfoDto.prototype, "ip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device user agent',
        example: 'Mozilla/5.0...',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeviceInfoDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device install ID',
        example: 'web_1234567890_abc123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeviceInfoDto.prototype, "installId", void 0);
class LoginDto {
    email;
    password;
    deviceInfo;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'password123',
        minLength: 6,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device information',
        type: DeviceInfoDto,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DeviceInfoDto),
    __metadata("design:type", DeviceInfoDto)
], LoginDto.prototype, "deviceInfo", void 0);
//# sourceMappingURL=login.dto.js.map