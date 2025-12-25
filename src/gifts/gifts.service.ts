import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

@Injectable()
export class GiftsService {
  constructor(private prisma: PrismaService) { }

  // Tạo quà
  async create(createGiftDto: CreateGiftDto, userId?: string) {
    const currentMonth = new Date().getMonth() + 1; // 0-11 nên phải +1
    if (currentMonth !== 12) {
      throw new ForbiddenException('Ho ho ho! Cỗ xe tuần lộc chỉ nhận quà vào tháng 12 thôi nhé! 🦌');
    }

    return this.prisma.gift.create({
      data: {
        content: createGiftDto.content,
        receiverName: createGiftDto.receiverName, // Tên hiển thị (luôn có)
        theme: createGiftDto.theme,

        // Link tới tài khoản người gửi (nếu đã đăng nhập)
        senderId: userId || null,

        // Link tới tài khoản người nhận (nếu tìm thấy trong hệ thống)
        // Lưu ý: Nếu receiverId là chuỗi rỗng "", ta chuyển thành null
        receiverId: createGiftDto.receiverId || null,
      },
    });
  }

  // Tìm kiếm người dùng (Cho tính năng Autocomplete)
  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          // Tìm theo tên hiển thị (không phân biệt hoa thường)
          { displayName: { contains: query, mode: 'insensitive' } },
          // Hoặc tìm theo email
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      // Chỉ lấy những thông tin cần thiết, KHÔNG lấy mật khẩu hay thông tin nhạy cảm
      select: {
        id: true,
        displayName: true,
        email: true,
        avatarUrl: true
      },
      take: 5 // Chỉ lấy tối đa 5 người để hiển thị cho gọn
    });
  }

  // Lấy quà của tôi
  async findMyGifts(userId: string) {
    return this.prisma.gift.findMany({
      where: {
        senderId: userId // Chỉ lấy quà của user này
      },
      orderBy: {
        createdAt: 'desc' // Sắp xếp mới nhất lên đầu
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