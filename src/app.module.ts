import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { TaskModule } from './task/task.module';

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig()), TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
