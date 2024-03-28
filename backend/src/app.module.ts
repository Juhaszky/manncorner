import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradesModule } from './trades/trades.module';
import { Trade } from './trades/entities/trade.entity';
import { ItemsModule } from './items/items.module';
import { Item } from './items/entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'MannCorner_Admin',
      password: 'mannCorner_2024!',
      database: 'MannCorner',
      entities: [Trade, Item],
      synchronize: true,
      options: {
        encrypt: false,
      },
    }),
    TradesModule,
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
