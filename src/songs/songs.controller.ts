import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';

@ApiTags('Songs')
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) { }

  @Post()
  // @UseGuards(AuthGuard('jwt')) 
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm bài hát mới (Dành cho Admin)' })
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài hát' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean, description: 'Truyền true để chỉ lấy bài hát đang hoạt động' })
  findAll(@Query('activeOnly') activeOnly?: string) {
    const isActiveOnly = activeOnly === 'true';
    return this.songsService.findAll(isActiveOnly);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một bài hát' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của bài hát' })
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt')) 
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Sửa thông tin bài hát (Dành cho Admin)' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của bài hát' })
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard('jwt')) 
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bài hát (Dành cho Admin)' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của bài hát' })
  remove(@Param('id') id: string) {
    return this.songsService.remove(id);
  }
}
