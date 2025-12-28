import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createGiftDto: CreateGiftDto, @Req() req) {
    return this.giftsService.create(createGiftDto, req.user.userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findMyGifts(@Req() req) {
    return this.giftsService.findMyGifts(req.user.userId);
  }

  @Get('search-users')
  @UseGuards(AuthGuard('jwt'))
  searchUsers(@Query('q') query: string) {
    return this.giftsService.searchUsers(query);
  }

  @Get('admin/all')
  findAll() {
    return this.giftsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('view') view: string // Thêm tham số này (ví dụ: ?view=edit)
  ) {
    // Nếu view là 'edit' -> KHÔNG đánh dấu là đã mở
    const isOpening = view !== 'edit';
    return this.giftsService.findOne(id, isOpening);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateGift(
    @Param('id') id: string,
    @Body() updateData: UpdateGiftDto,
    @Req() req: any
  ) {
    return this.giftsService.updateGift(req.user.userId, id, updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteGift(@Param('id') id: string, @Req() req: any) {
    return this.giftsService.deleteGift(req.user.userId, id);
  }
}