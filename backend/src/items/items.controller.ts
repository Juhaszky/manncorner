import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get('/all-items')
  getAllItems(): Promise<any> {
    return this.itemsService.getAllItems();
  }
  @Post()
  create(@Body() createItemDto: CreateItemDto[]) {
    const items = createItemDto;
    items.forEach((itemData: any) => {
      const item = new Item();
      item.name = itemData.name ?? '';
      item.item_class = itemData.item_class ?? '';
      item.item_slot = itemData.item_slot ?? '';
      item.item_quality = itemData.item_quality ?? '';
      item.image_url = itemData.image_url ?? '';
      item.image_url_large = itemData.image_url_large ?? '';
      item.craft_class = itemData.craft_class ?? '';
      item.craft_material_type = itemData.craft_material_type ?? '';
      item.descriptions = itemData.descriptions ?? '';
      item.market_name = itemData.market_name ?? '';
      if (item.image_url !== '') return this.itemsService.create(item);
    });
  }

  @Get()
  findAll() {
    return '';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
