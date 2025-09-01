import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, IsUrl, Min, Max } from 'class-validator';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ description: 'Course title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Course slug (URL-friendly)' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Course description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Course price in cents' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Currency code (e.g., TRY, USD)' })
  @IsString()
  currency: string;

  @ApiProperty({ description: 'Course duration in minutes' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Course level', enum: CourseLevel })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ description: 'Course language' })
  @IsString()
  language: string;

  @ApiProperty({ description: 'Course thumbnail URL' })
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @ApiProperty({ description: 'Course preview video URL' })
  @IsOptional()
  @IsUrl()
  previewVideo?: string;

  @ApiProperty({ description: 'Course meta title for SEO' })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ description: 'Course meta description for SEO' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ description: 'Course tags' })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Course requirements' })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiProperty({ description: 'What students will learn' })
  @IsOptional()
  @IsString()
  whatYouWillLearn?: string;

  @ApiProperty({ description: 'Target audience' })
  @IsOptional()
  @IsString()
  targetAudience?: string;
}
