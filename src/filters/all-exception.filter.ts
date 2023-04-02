import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AxiosError } from 'axios';
import { get, pick } from 'lodash';
import { IS_PRODUCTION } from 'src/common/constant';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof AxiosError) {
      console.log({
        config: pick(exception.config, ['headers', 'method', 'url', 'data']),
        response: exception.response?.data,
      });

      if (!IS_PRODUCTION)
        throw new BadRequestException(get(exception, 'response.data.message'));
    }

    super.catch(exception, host);
  }
}
