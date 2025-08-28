import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit{
   constructor(private dataSource: DataSource) {}
  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    try {
      if (this.dataSource.isInitialized) {
        console.log('Database already connected');
      } else {
        await this.dataSource.initialize();
        console.log('Database connected successfully');
      }
    } catch (err) {
      console.error('Database connection failed:', err);
    }
  }
}







