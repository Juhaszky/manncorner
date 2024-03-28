import { Injectable } from '@nestjs/common';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    private readonly httpService: HttpService,
  ) {}
  async create(itemData: Item) {
    console.log(itemData);
    const item = itemData;
    this.itemRepository.create(item);
    await this.itemRepository.save(item);
    return item;
  }

  getAllItems(): Promise<any> {
    return this.itemRepository.find();
    // return this.httpService
    //   .get(
    //     'https://api.steampowered.com/IEconItems_440/GetSchemaItems/v0001/?key=17F30AEE22C8E49C0F2CFD2BB6FE0398',
    //   )
    //   .pipe(
    //     map((res: any) => {
    //       console.log(res.data.result);
    //       return res.data.result.items;
    //     }),
    //   );

    // try {
    //   const response = await fetch(
    //     'https://api.steampowered.com/IEconItems_440/GetSchemaItems/v0001/?key=17F30AEE22C8E49C0F2CFD2BB6FE0398',
    //   );
    //   console.log(response);
    //   // if (!response.ok) {
    //   //   throw new Error(`Failed to fetch data. Status: ${response.status}`);
    //   // }

    //   const data = await response.json();
    //   console.log(data);
    //   return data.result.items;
    // } catch (error) {
    //   console.error('Error fetching data:', error.message);
    //   throw error;
    // }
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
