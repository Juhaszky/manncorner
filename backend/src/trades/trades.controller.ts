import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { Trade } from './entities/trade.entity';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  create(@Body() createTradeDto: CreateTradeDto) {
    const trade = new Trade();
    console.log(createTradeDto);
    trade.itemsFrom = JSON.stringify(createTradeDto.itemsFrom);
    trade.itemsTo = JSON.stringify(createTradeDto.itemsTo);
    trade.postDate = JSON.stringify(createTradeDto.postDate);
    trade.owner = JSON.stringify(createTradeDto.owner);
    console.log(createTradeDto);
    return this.tradesService.create(trade);
  }

  // @Get()
  // findAll() {
  //   return this.tradesService.findAll();
  // }

  @Get()
  async getTrades(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.tradesService.getTrades(page, pageSize);
  }

  @Get('amount')
  async getAmount() {
    return this.tradesService.getTotalRows();
  }

  @Get(':id')
  async getTradeById(@Param('id') id: string): Promise<Trade> {
    console.log(id);
    return this.tradesService.getTradeById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTradeDto: UpdateTradeDto) {
  //   return this.tradesService.update(+id, updateTradeDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradesService.remove(+id);
  }
}
