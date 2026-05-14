import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song, SongDocument } from './schemas/song.schema';

@Injectable()
export class SongsService {
  constructor(
    @InjectModel(Song.name) private songModel: Model<SongDocument>
  ) { }

  private checkValidObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID không hợp lệ!');
    }
  }

  async create(createSongDto: CreateSongDto) {
    const newSong = new this.songModel(createSongDto);
    return newSong.save();
  }

  async findAll(isActiveOnly: boolean = false) {
    const query = isActiveOnly ? { isActive: true } : {};
    return this.songModel.find(query).exec();
  }

  async findOne(id: string) {
    this.checkValidObjectId(id);
    const song = await this.songModel.findById(id).exec();
    if (!song) throw new NotFoundException('Không tìm thấy bài hát này!');
    return song;
  }

  async update(id: string, updateSongDto: UpdateSongDto) {
    this.checkValidObjectId(id);
    const updatedSong = await this.songModel.findByIdAndUpdate(
      id,
      updateSongDto,
      { new: true }
    ).exec();

    if (!updatedSong) throw new NotFoundException('Không tìm thấy bài hát để cập nhật!');
    return updatedSong;
  }

  async remove(id: string) {
    this.checkValidObjectId(id);
    const deletedSong = await this.songModel.findByIdAndDelete(id).exec();
    if (!deletedSong) throw new NotFoundException('Không tìm thấy bài hát để xóa!');
    return { message: 'Đã xóa bài hát thành công' };
  }
}
