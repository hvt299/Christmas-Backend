import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish, WishDocument } from './schemas/wish.schema';

@Injectable()
export class WishesService {
  constructor(
    @InjectModel(Wish.name) private wishModel: Model<WishDocument>
  ) { }

  private checkValidObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID không hợp lệ!');
    }
  }

  async create(createWishDto: CreateWishDto) {
    const newWish = new this.wishModel({
      message: createWishDto.message,
      decorationType: createWishDto.decorationType || 'star',
      userId: createWishDto.userId || null,
    });
    return newWish.save();
  }

  async findAll() {
    return this.wishModel
      .find()
      .populate('userId', 'fullName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    this.checkValidObjectId(id);
    const wish = await this.wishModel.findById(id).populate('userId', 'fullName avatar').exec();
    if (!wish) throw new NotFoundException('Không tìm thấy điều ước này!');
    return wish;
  }

  async update(id: string, updateWishDto: UpdateWishDto) {
    this.checkValidObjectId(id);
    const updatedWish = await this.wishModel.findByIdAndUpdate(
      id,
      updateWishDto,
      { new: true }
    ).exec();

    if (!updatedWish) throw new NotFoundException('Không tìm thấy điều ước để cập nhật!');
    return updatedWish;
  }

  async remove(id: string) {
    this.checkValidObjectId(id);
    const deletedWish = await this.wishModel.findByIdAndDelete(id).exec();
    if (!deletedWish) throw new NotFoundException('Không tìm thấy điều ước để xóa!');
    return { message: 'Đã xóa điều ước thành công' };
  }
}
