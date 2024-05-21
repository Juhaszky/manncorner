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
    return this.tradeRepository.find();
  }

  async getTrades(pageNumber: number, pageSize: number): Promise<Trade[]> {
    pageNumber = pageNumber && pageNumber > 0 ? pageNumber : 1;
    pageSize = pageSize && pageSize > 0 ? pageSize : 10;
    return this.tradeRepository.find({
      order: {
        postDate: 'DESC',
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
  }

  async getTotalRows(): Promise<number> {
    return this.tradeRepository.count();
  }

  // update(id: number, updateTradeDto: UpdateTradeDto) {
  //   return `This action updates a #${id} trade`;
  // }

  remove(id: number) {
    return `This action removes a #${id} trade`;
  }
}
