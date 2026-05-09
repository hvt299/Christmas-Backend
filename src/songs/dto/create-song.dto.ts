import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSongDto {
    @ApiProperty({ example: 'Jingle Bells', description: 'Tên bài hát' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Michael Bublé', description: 'Tên ca sĩ/nghệ sĩ' })
    @IsString()
    @IsNotEmpty()
    artist: string;

    @ApiProperty({ example: 'https://example.com/audio.mp3', description: 'Đường dẫn file nhạc' })
    @IsString()
    @IsNotEmpty()
    url: string;

    @ApiPropertyOptional({ example: 'https://example.com/cover.jpg', description: 'Ảnh bìa bài hát' })
    @IsString()
    @IsOptional()
    coverUrl?: string;

    @ApiPropertyOptional({ example: true, description: 'Trạng thái hoạt động' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
