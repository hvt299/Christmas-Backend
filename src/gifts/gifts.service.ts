import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { Gift, GiftDocument } from './schemas/gift.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class GiftsService {
  constructor(
    @InjectModel(Gift.name) private giftModel: Model<GiftDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }

  private checkValidObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID không hợp lệ!');
    }
  }

  async create(createGiftDto: CreateGiftDto, userId?: string) {
    const currentMonth = new Date().getMonth() + 1;
    if (currentMonth !== 12) {
      throw new ForbiddenException('Ho ho ho! Cỗ xe tuần lộc chỉ nhận quà vào tháng 12 thôi nhé! 🦌');
    }

    const newGift = new this.giftModel({
      content: createGiftDto.content,
      receiverName: createGiftDto.receiverName,
      theme: createGiftDto.theme,
      senderId: userId || null,
      receiverId: createGiftDto.receiverId || null,
    });

    return newGift.save();
  }

  async searchUsers(query: string) {
    return this.userModel.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
      .select('_id fullName email avatar')
      .limit(5)
      .exec();
  }

  async findMyGifts(userId: string) {
    return this.giftModel
      .find({ senderId: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  findAll() {
    return this.giftModel.find().exec();
  }

  async findOne(id: string, shouldMarkOpen: boolean = true) {
    this.checkValidObjectId(id);

    const gift = await this.giftModel
      .findById(id)
      .populate('senderId', 'fullName avatar')
      .exec();

    if (!gift) {
      throw new NotFoundException('Hộp quà này không tồn tại!');
    }

    if (shouldMarkOpen && !gift.isOpened) {
      gift.isOpened = true;
      gift.openedAt = new Date();
      await gift.save();
    }

    return gift;
  }

  async updateGift(userId: string, giftId: string, updateGiftDto: UpdateGiftDto) {
    this.checkValidObjectId(giftId);

    const gift = await this.giftModel.findById(giftId).exec();
    if (!gift) throw new NotFoundException('Không tìm thấy quà');

    if (gift.senderId?.toString() !== userId) {
      throw new ForbiddenException('Không được sửa quà của người khác!');
    }

    return this.giftModel.findByIdAndUpdate(
      giftId,
      {
        content: updateGiftDto.content,
        theme: updateGiftDto.theme,
        musicUrl: updateGiftDto.musicUrl,
        receiverName: updateGiftDto.receiverName,
        receiverId: updateGiftDto.receiverId || null,
      },
      { new: true }
    ).exec();
  }

  async deleteGift(userId: string, giftId: string) {
    this.checkValidObjectId(giftId);

    const gift = await this.giftModel.findById(giftId).exec();
    if (!gift) {
      throw new NotFoundException('Món quà này không tồn tại hoặc đã bị xóa!');
    }

    if (gift.senderId?.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa món quà của người khác!');
    }

    return this.giftModel.findByIdAndDelete(giftId).exec();
  }
}