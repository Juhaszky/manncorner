import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  'name': string;
  @Column()
  'item_class': string;
  @Column()
  'item_slot': string;
  @Column()
  'item_quality': number;
  @Column()
  'image_url': string;
  @Column()
  'image_url_large': string;
  @Column()
  'craft_class': string;
  @Column()
  'craft_material_type': string;
  @Column()
  'descriptions': string;
  @Column()
  'market_name': string;
}
