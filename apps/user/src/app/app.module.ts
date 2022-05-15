import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DatabaseModule, userProviders } from '@libs/db';

import { UserController } from './app.controller';
import { UserService } from './app.service';

import { HeaderMiddleware } from './middleware/header.middleware';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeaderMiddleware).forRoutes('*');
  }
}
