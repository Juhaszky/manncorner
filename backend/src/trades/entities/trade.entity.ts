import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'nvarchar',
    length: 1000,
  })
  itemsFrom: string;

  @Column({
    type: 'nvarchar',
    length: 1000,
  })
  itemsTo: string;

  @Column({
    type: 'nvarchar',
    length: 1000,
  })
  postDate: string;
  @Column({
    type: 'nvarchar',
    length: 1000,
  })
  owner: string;
}
