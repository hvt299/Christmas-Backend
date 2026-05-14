import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Gifts')
@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo hộp quà mới (Cần đăng nhập)' })
  create(@Body() createGiftDto: CreateGiftDto, @Req() req: any) {
    return this.giftsService.create(createGiftDto, req.user.userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách hộp quà của tôi (Cần đăng nhập)' })
  findMyGifts(@Req() req: any) {
    return this.giftsService.findMyGifts(req.user.userId);
  }

  @Get('search-users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tìm kiếm người dùng để gửi quà' })
  @ApiQuery({ name: 'q', required: true, description: 'Nhập tên hoặc email cần tìm' })
  searchUsers(@Query('q') query: string) {
    return this.giftsService.searchUsers(query);
  }

  @Get('admin/all')
  @ApiOperation({ summary: 'Lấy tất cả hộp quà (Dành cho Admin)' })
  findAll() {
    return this.giftsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết / Mở hộp quà' })
  @ApiParam({ name: 'id', description: 'ID của hộp quà (MongoDB ObjectId)' })
  @ApiQuery({ name: 'view', required: false, description: 'Truyền "edit" để chỉ xem form sửa, không tính là Mở quà' })
  async findOne(
    @Param('id') id: string,
    @Query('view') view: string
  ) {
    const isOpening = view !== 'edit';
    return this.giftsService.findOne(id, isOpening);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sửa nội dung quà (Chính chủ)' })
  @ApiParam({ name: 'id', description: 'ID của hộp quà' })
  async updateGift(
    @Param('id') id: string,
    @Body() updateData: UpdateGiftDto,
    @Req() req: any
  ) {
    return this.giftsService.updateGift(req.user.userId, id, updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa hộp quà (Chính chủ)' })
  @ApiParam({ name: 'id', description: 'ID của hộp quà' })
  async deleteGift(@Param('id') id: string, @Req() req: any) {
    return this.giftsService.deleteGift(req.user.userId, id);
  }
}