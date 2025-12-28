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

  async updateGift(userId: string, giftId: string, UpdateGiftDto: UpdateGiftDto) {
    // 1. Tìm quà
    const gift = await this.prisma.gift.findUnique({ where: { id: giftId } });

    if (!gift) throw new NotFoundException('Không tìm thấy quà');

    // 2. Check quyền chính chủ
    if (gift.senderId !== userId) {
      throw new ForbiddenException('Không được sửa quà của người khác!');
    }

    // 3. Update
    return this.prisma.gift.update({
      where: { id: giftId },
      data: {
        content: UpdateGiftDto.content,
        theme: UpdateGiftDto.theme,
        musicUrl: UpdateGiftDto.musicUrl,
        receiverName: UpdateGiftDto.receiverName,
        // Không cho phép sửa senderId hoặc receiverId tùy ý
      },
    });
  }

  // Xóa hộp quà
  async deleteGift(userId: string, giftId: string) {
    // 1. Tìm xem món quà có tồn tại không
    const gift = await this.prisma.gift.findUnique({
      where: { id: giftId },
    });

    if (!gift) {
      throw new NotFoundException('Món quà này không tồn tại hoặc đã bị xóa!');
    }

    // 2. QUAN TRỌNG: Kiểm tra quyền sở hữu (Chính chủ mới được xóa)
    // So sánh ID người đang đăng nhập (userId) với người tạo quà (senderId)
    if (gift.senderId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa món quà của người khác!');
    }

    // 3. Nếu mọi thứ ok -> Tiến hành xóa
    return this.prisma.gift.delete({
      where: { id: giftId },
    });
  }
}