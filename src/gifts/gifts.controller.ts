import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dto/create-gift.dto';
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

  @Get()
  findAll() {
    return this.giftsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giftsService.findOne(id);
  }
}