import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class VideoSecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Temporarily disable all video security for testing
    // if (req.path.includes('/secure-video') || req.path.includes('/videos/')) {
    //   // Add security headers to prevent video downloading
    //   res.set({
    //     'X-Content-Type-Options': 'nosniff',
    //     'X-Frame-Options': 'DENY',
    //     'X-Download-Options': 'noopen',
    //     'X-Permitted-Cross-Domain-Policies': 'none',
    //     'Referrer-Policy': 'strict-origin-when-cross-origin',
    //     'Content-Security-Policy': "default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    //     'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    //     'Pragma': 'no-cache',
    //     'Expires': '0',
    //     'Surrogate-Control': 'no-store'
    //   });
    // }

    next();
  }
}
