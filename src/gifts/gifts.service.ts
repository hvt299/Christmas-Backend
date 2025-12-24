import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service'; // Import PrismaService
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto'; // Nest tự tạo file này

@Injectable()
export class GiftsService {
  constructor(private prisma: PrismaService) {}

  // Tạo quà
  async create(createGiftDto: CreateGiftDto, userId?: string) {
    return this.prisma.gift.create({
      data: {
        ...createGiftDto,
        senderId: userId || null, 
      },
    });
  }

  // Lấy tất cả (Dùng để test, sau này xóa cũng được)
  findAll() {
    return this.prisma.gift.findMany();
  }

  // Mở hộp quà (Tìm theo ID)
  async findOne(id: string) {
    const gift = await this.prisma.gift.findUnique({
      where: { id },
      include: { 
        sender: { select: { displayName: true, avatarUrl: true } } 
      },
    });

    if (!gift) {
      throw new NotFoundException('Hộp quà này không tồn tại!');
    }

    // Nếu chưa mở thì đánh dấu là đã mở
    if (!gift.isOpened) {
      await this.prisma.gift.update({
        where: { id },
        data: { isOpened: true, openedAt: new Date() },
      });
    }

    return gift;
  }
  
  // Các hàm update/remove mặc định bạn có thể để trống hoặc xóa đi nếu chưa dùng
  update(id: number, updateGiftDto: UpdateGiftDto) { return `This action updates a #${id} gift`; }
  remove(id: number) { return `This action removes a #${id} gift`; }
}