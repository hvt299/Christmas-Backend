import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

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

  @Get()
  findAll() {
    return this.giftsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giftsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateGift(
    @Param('id') id: string, 
    @Body() updateData: UpdateGiftDto,
    @Req() req: any
  ) {
    const userId = req.user.id || req.user.sub;
    return this.giftsService.updateGift(userId, id, updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteGift(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.giftsService.deleteGift(userId, id);
  }
}