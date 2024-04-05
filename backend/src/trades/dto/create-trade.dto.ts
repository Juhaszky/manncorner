import { IsNotEmpty } from 'class-validator';

export class CreateTradeDto {
  readonly id: number;
  @IsNotEmpty()
  readonly itemsFrom: string;
  @IsNotEmpty()
  readonly itemsTo: string;
  @IsNotEmpty()
  readonly postDate: string;
  @IsNotEmpty()
  readonly owner: string;
}
