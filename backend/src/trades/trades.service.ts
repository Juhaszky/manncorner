import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from './entities/trade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade) private tradeRepository: Repository<Trade>,
  ) {}
  async create(tradeData: Trade) {
    console.log(tradeData);
    const trade = tradeData;
    this.tradeRepository.create(trade);
    await this.tradeRepository.save(trade);
    return trade;
  }

  findAll() {
    return `This action returns all trades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trade`;
  }

  // update(id: number, updateTradeDto: UpdateTradeDto) {
  //   return `This action updates a #${id} trade`;
  // }

  remove(id: number) {
    return `This action removes a #${id} trade`;
  }
}
