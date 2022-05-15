import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { MongoConfigService } from './services/config/mongo-config.service';
import { UserLinkSchema } from './schemas/user-link.schema';
import { UserSchema } from './schemas/user.schema';
import { UserService } from './app.service';
import { UserController } from './app.controller';
import { ConfigService } from './Services/config/config.service';

describe('USER SERVICE', () => {
  jest.setTimeout(30000);

  let service: UserService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useClass: MongoConfigService,
        }),
        MongooseModule.forFeature([
          {
            name: 'User',
            schema: UserSchema,
            collection: 'users',
          },
          {
            name: 'UserLink',
            schema: UserLinkSchema,
            collection: 'user_links',
          },
        ]),
      ],
      controllers: [UserController],
      providers: [UserService, ConfigService],
    }).compile();

    service = app.get<UserService>(UserService);
  });

  describe('test', () => {
    it('should init service instance', () => {
      expect(service).toBeDefined;
    });
  });
});
