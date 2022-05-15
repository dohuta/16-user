import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
// import * as bcrypt from 'bcrypt';

import { UserService } from './app.service';
import {
  BaseResponse,
  FindUserResponse,
  SignUpPayload,
  SignUpResponse,
} from '@libs/dtos';
import { User } from '@libs/db';

@Controller('users')
@ApiTags('users')
export class UserController {
  // logger declaration
  private readonly logger = new Logger(`USER::${UserController.name}`);

  constructor(private readonly userService: UserService) {}

  @Get()
  public async searchUserByEmail(
    @Query() params
  ): Promise<BaseResponse<FindUserResponse | null>> {
    this.logger.log(
      `${this.searchUserByEmail.name} called::request ${JSON.stringify(params)}`
    );

    let result: BaseResponse<FindUserResponse | null>;

    if (params.username) {
      const user = await this.userService.searchUser({
        email: params.username,
      });

      if (user && user.length == 1 && user[0].id) {
        result = {
          status: HttpStatus.OK,
          message: 'user_search_by_email_success',
          data: FindUserResponse.fromEntity(user[0]),
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_search_by_email_not_found',
          data: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.NOT_FOUND,
        message: 'user_search_by_email_not_found',
        data: null,
      };
    }

    this.logger.log(
      `${this.searchUserByEmail.name} responses::result ${JSON.stringify(
        result
      )}`
    );

    return result;
  }

  @Get(':id')
  public async getUserById(
    @Param() id: number
  ): Promise<BaseResponse<FindUserResponse | null>> {
    this.logger.log(`${this.getUserById.name} called::request ${id}`);

    let result: BaseResponse<FindUserResponse | null>;

    if (id) {
      const user = await this.userService.searchUserById(id);
      if (user) {
        result = {
          status: HttpStatus.OK,
          message: 'user_get_by_id_success',
          data: FindUserResponse.fromEntity(user),
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_get_by_id_not_found',
          data: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_get_by_id_bad_request',
        data: null,
      };
    }

    this.logger.log(
      `${this.getUserById.name} response::result ${JSON.stringify(result)}`
    );

    return result;
  }

  @Post('signup')
  public async createUser(
    @Body() userParams: SignUpPayload
  ): Promise<BaseResponse<SignUpResponse | string>> {
    this.logger.log(
      `${this.createUser.name} called::request ${JSON.stringify(
        JSON.stringify(userParams)
      )}`
    );

    let result: BaseResponse<SignUpResponse | string>;

    if (userParams && userParams.password && userParams.username) {
      const usersWithEmail = await this.userService.searchUser({
        email: userParams.username,
      });

      if (usersWithEmail && usersWithEmail.length > 0) {
        result = {
          status: HttpStatus.CONFLICT,
          message: 'user_create_conflict',
          data: 'Email đã tồn tại',
        };
      } else {
        try {
          const createdUser = await this.userService.createUser(userParams);
          delete createdUser.password;
          result = {
            status: HttpStatus.CREATED,
            message: 'user_create_success',
            data: SignUpResponse.fromEntity(createdUser),
          };
        } catch (e) {
          result = {
            status: HttpStatus.PRECONDITION_FAILED,
            message: 'user_create_precondition_failed',
            data: 'Không thể tạo Account',
          };
        }
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_create_bad_request',
        data: 'Thiếu thông tin',
      };
    }

    this.logger.log(
      `${this.createUser.name} responses::result ${JSON.stringify(
        JSON.stringify(result)
      )}`
    );

    return result;
  }

  // private compareEncryptedPassword(a, b) {
  //   return bcrypt.compare(b, a);
  // }
}
