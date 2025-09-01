import { Controller, Get, Param, Request, UseGuards, ForbiddenException, Res, UnauthorizedException, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SecureVideoService } from './secure-video.service';
import { JwtService } from '@nestjs/jwt';
import { AccessGrantsService } from '../access-grants/access-grants.service';

@ApiTags('secure-video')
@Controller('secure-video')
export class SecureVideoController {
  constructor(
    private readonly secureVideoService: SecureVideoService,
    private readonly jwtService: JwtService,
    private readonly accessGrantsService: AccessGrantsService
  ) {}

  @Get('lesson/:lessonId/stream')
  @UseGuards(JwtAuthGuard) // Re-enabled JWT authentication
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get secure video streaming URL' })
  @ApiResponse({
    status: 200,
    description: 'Secure video streaming info retrieved successfully',
  })
  async getVideoStreamingInfo(
    @Param('lessonId') lessonId: string,
    @Request() req: any,
    @Res() res: any
  ) {
    try {
      // Use authenticated user from JWT token
      const userId = req.user.id;
      console.log(`🎥 Getting secure video streaming info for lesson ${lessonId} by user ${userId}`);
      
      const streamingInfo = await this.secureVideoService.getVideoStreamingInfo(
        userId,
        lessonId
      );

      // Add security headers to prevent downloading
      res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-Download-Options': 'noopen',
        'X-Permitted-Cross-Domain-Policies': 'none',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
      });

      return res.json({
        success: true,
        data: streamingInfo,
        message: 'Video streaming info retrieved successfully',
      });
    } catch (error) {
      console.error('❌ Error getting video streaming info:', error);
      throw error;
    }
  }

  // NEW: Direct video streaming endpoint to avoid CORS issues
  @Get('lesson/:lessonId/video')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get secure video streaming URL' })
  @ApiResponse({
    status: 200,
    description: 'Secure video URL retrieved successfully',
  })
  async streamVideo(
    @Param('lessonId') lessonId: string,
    @Request() req: any,
    @Res() res: any
  ) {
    try {
      const userId = req.user.id;
      console.log(`🎬 Getting secure video URL for lesson ${lessonId} by user ${userId}`);
      
      // Get secure video URL directly
      const secureUrl = await this.secureVideoService.generateSecureVideoUrl(userId, lessonId);
      
      // Set CORS headers
      res.set({
        'Access-Control-Allow-Origin': 'http://localhost:3002',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Authorization',
        'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length',
      });

      return res.json({
        success: true,
        data: {
          secureUrl: secureUrl,
          message: 'Secure video URL generated successfully'
        }
      });
      
    } catch (error) {
      console.error('❌ Error getting secure video URL:', error);
      throw error;
    }
  }

  @Get('lesson/:lessonId/thumbnail')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get secure thumbnail URL' })
  @ApiResponse({
    status: 200,
    description: 'Secure thumbnail URL retrieved successfully',
  })
  async getSecureThumbnailUrl(
    @Param('lessonId') lessonId: string,
    @Request() req: any
  ) {
    try {
      console.log(`🖼️ Getting secure thumbnail URL for lesson ${lessonId} by user ${req.user.id}`);
      
      const thumbnailUrl = await this.secureVideoService.generateSecureThumbnailUrl(
        req.user.id,
        lessonId
      );

      return {
        success: true,
        data: { thumbnailUrl },
        message: 'Secure thumbnail URL retrieved successfully',
      };
    } catch (error) {
      console.error('❌ Error getting secure thumbnail URL:', error);
      throw error;
    }
  }

  @Get('lesson/:lessonId/token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get video access token' })
  @ApiResponse({
    status: 200,
    description: 'Video access token generated successfully',
  })
  async getVideoToken(
    @Param('lessonId') lessonId: string,
    @Request() req: any
  ) {
    try {
      console.log(`🔑 Generating video token for lesson ${lessonId} by user ${req.user.id}`);
      
      const token = await this.secureVideoService.generateVideoToken(
        req.user.id,
        lessonId
      );

      return {
        success: true,
        data: { token },
        message: 'Video access token generated successfully',
      };
    } catch (error) {
      console.error('❌ Error generating video token:', error);
      throw error;
    }
  }

  @Get('verify/:lessonId/:token')
  @ApiOperation({ summary: 'Verify video access token' })
  @ApiResponse({
    status: 200,
    description: 'Token verification result',
  })
  async verifyToken(
    @Param('lessonId') lessonId: string,
    @Param('token') token: string
  ) {
    try {
      console.log(`🔍 Verifying video token for lesson ${lessonId}`);
      
      // Decode JWT token to verify it's valid
      const decoded = this.jwtService.verify(token);
      
      // Check if token is for the correct lesson
      if (decoded.lessonId !== lessonId) {
        throw new UnauthorizedException('Invalid token for this lesson');
      }

      // Check if user still has access to the lesson
      const hasAccess = await this.accessGrantsService.checkLessonAccess(
        decoded.userId,
        lessonId
      );

      if (!hasAccess) {
        throw new UnauthorizedException('User no longer has access to this lesson');
      }

      return {
        success: true,
        data: { 
          isValid: true,
          userId: decoded.userId,
          lessonId: decoded.lessonId,
          expiresAt: decoded.exp
        },
        message: 'Token verification completed',
      };
    } catch (error) {
      console.error('❌ Error verifying token:', error);
      throw error;
    }
  }

  @Get('lesson/:lessonId/access-check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if user has access to lesson video' })
  @ApiResponse({
    status: 200,
    description: 'Access check completed',
  })
  async checkVideoAccess(
    @Param('lessonId') lessonId: string,
    @Request() req: any
  ) {
    try {
      console.log(`🔒 Checking video access for lesson ${lessonId} by user ${req.user.id}`);
      
      // This will throw ForbiddenException if no access
      await this.secureVideoService.generateVideoToken(req.user.id, lessonId);

      return {
        success: true,
        data: { hasAccess: true },
        message: 'User has access to this lesson video',
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        return {
          success: false,
          data: { hasAccess: false },
          message: 'User does not have access to this lesson video',
        };
      }
      throw error;
    }
  }
}
