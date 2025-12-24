import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateGiftDto {
  @IsString()
  @IsNotEmpty({ message: 'Lời chúc không được để trống đâu nhé!' })
  content: string;

  @IsString()
  @IsNotEmpty({ message: 'Phải có tên người nhận chứ!' })
  receiverName: string; 

  @IsString()
  @IsOptional()
  receiverId?: string; // ID người nhận (nếu họ có tài khoản)

  @IsString()
  @IsOptional()
  theme?: string; // Màu hộp quà: 'red', 'green'...

  @IsString()
  @IsOptional()
  musicUrl?: string; // Link nhạc kèm theo
}