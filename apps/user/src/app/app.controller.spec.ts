import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './app.module';
import { UserController } from './app.controller';

describe('User microservice', () => {
  jest.setTimeout(30000);

  let controller: UserController;

  beforeAll(async () => {});

  afterAll(async () => {});

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = moduleFixture.get<UserController>(UserController);
  });

  it('should create a valid user', async () => {
    const requestData = {
      username: 'test2@test.com',
      password: 'test111',
    };
    const result = await controller.createUser(requestData);

    expect(result.status).toBe(201);
    expect(result.message).toBe('user_create_success');
    expect(result.data).toBeTruthy();
  });
  it('should search user', async () => {
    const requestData = { email: 'taphuynh@dxc.com' };
    const result = await controller.searchUserByEmail(requestData);

    expect(result.status).toBe(200);
    expect(result.message).toBe('user_search_by_email_success');
    expect(result.data).toBeTruthy();
  });
});
