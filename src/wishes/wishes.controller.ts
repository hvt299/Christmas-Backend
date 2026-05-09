import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) { }

  @Post()
  @ApiOperation({ summary: 'Treo một điều ước lên cây thông (Hỗ trợ ẩn danh)' })
  create(@Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả điều ước trên cây' })
  findAll() {
    return this.wishesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một điều ước' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của điều ước' })
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sửa điều ước' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của điều ước' })
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(id, updateWishDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Gỡ điều ước khỏi cây' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của điều ước' })
  remove(@Param('id') id: string) {
    return this.wishesService.remove(id);
  }
}
