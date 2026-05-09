import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGiftDto {
  @ApiProperty({ example: 'Chúc bạn Giáng Sinh ấm áp nhé! 🎄', description: 'Nội dung lời chúc' })
  @IsString()
  @IsNotEmpty({ message: 'Lời chúc không được để trống đâu nhé!' })
  content: string;

  @ApiProperty({ example: 'Gửi Crush', description: 'Tên người nhận (hiển thị trên nắp hộp)' })
  @IsString()
  @IsNotEmpty({ message: 'Phải có tên người nhận chứ!' })
  receiverName: string;

  @ApiPropertyOptional({ example: '65a1b2c3d4e5f6g7h8i9j0k1', description: 'ID tài khoản người nhận (nếu có)' })
  @IsString()
  @IsOptional()
  receiverId?: string;

  @ApiPropertyOptional({ example: 'red_box', description: 'Màu hộp quà' })
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiPropertyOptional({ example: 'https://example.com/jingle-bells.mp3', description: 'Link nhạc đính kèm' })
  @IsString()
  @IsOptional()
  musicUrl?: string;
}