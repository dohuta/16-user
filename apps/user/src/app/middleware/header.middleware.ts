import {
  Injectable,
  NestMiddleware,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  /**
   * Verify the requests header on api-gateway
   *
   * @param request - The request
   * @param response - The response
   * @param next - The next function
   */
  private readonly logger = new Logger(`USER.${HeaderMiddleware.name}`);

  use(request: Request, response: Response, next: NextFunction): void {
    const headers = request.headers;

    this.logger.log(`request ${JSON.stringify(headers)}`);

    if (headers['x-api-key'] && headers['x-api-key'] == process.env.SECRET) {
      this.logger.log(`request is valid`);
      next();
    } else {
      this.logger.log(`request is invalid`);
      throw new BadRequestException(`Bad Request`);
    }
  }
}
