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
    // Khi qua được lính gác, thông tin user sẽ nằm trong req.user
    const user = req.user;
    
    // Truyền userId vào service
    return this.giftsService.create(createGiftDto, user.userId);
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