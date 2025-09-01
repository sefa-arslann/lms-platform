import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SemestersService {
  constructor(private prisma: PrismaService) {}

  // Basit bir dönem bilgisi döndür (şimdilik sabit)
  async getCurrentPeriod() {
    return {
      name: "2024-2025 Eğitim Dönemi",
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
      isActive: true,
    };
  }

  // Kurs erişim süresini hesapla (varsayılan 1 yıl)
  async calculateCourseAccessDuration() {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    
    return {
      startDate: now,
      endDate: expiresAt,
      durationInDays: 365,
    };
  }
}
