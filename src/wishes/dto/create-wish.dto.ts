import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWishDto {
    @ApiProperty({ example: 'Chúc mọi người một mùa Giáng Sinh an lành! ❄️', description: 'Nội dung điều ước' })
    @IsString()
    @IsNotEmpty({ message: 'Lời chúc không được để trống' })
    message!: string;

    @ApiPropertyOptional({ example: 'star', description: 'Loại đồ trang trí (star, ball, sock, tree...)' })
    @IsString()
    @IsOptional()
    decorationType?: string;

    @ApiPropertyOptional({ example: '65a1b2c3d4e5f6g7h8i9j0k1', description: 'ID người dùng (nếu đã đăng nhập, bỏ trống nếu là ẩn danh)' })
    @IsString()
    @IsOptional()
    userId?: string;
}