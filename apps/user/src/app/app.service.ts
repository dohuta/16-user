import { Inject, Injectable, Logger } from '@nestjs/common';

import { User } from '@libs/db';
import { SignUpPayload } from '@libs/dtos';

@Injectable()
export class UserService {
  // logger declaration
  private readonly logger = new Logger(`USER::${UserService.name}`);

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly repo: typeof User
  ) {}

  public async searchUser(params: { email: string }): Promise<User[]> {
    this.logger.log(`${this.searchUser.name} called`);
    const r = await this.repo.findAll({ where: params });
    return r;
  }

  public async searchUserById(id: number): Promise<User> {
    this.logger.log(`${this.searchUserById.name} called`);
    return this.repo.findOne({ where: { id } });
  }

  public async createUser(user: SignUpPayload): Promise<User> {
    this.logger.log(`${this.createUser.name} called`);
    const u: any = {};
    // u.id = uuidv4();
    u.email = user.username;
    u.password = user.password;
    u.isConfirmed = true;
    return this.repo.create(u);
  }
}
