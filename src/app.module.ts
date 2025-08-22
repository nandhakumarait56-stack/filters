import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductModule } from './products/product.module';

@Module({
  imports: [
       ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // folder to serve
      serveRoot: '/uploads', // URL path
    }),
    MongooseModule.forRoot('mongodb+srv://nandhakumarait56:Nandhaait56@college.dj7j5vg.mongodb.net/?retryWrites=true&w=majority&appName=College'),
    UsersModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
