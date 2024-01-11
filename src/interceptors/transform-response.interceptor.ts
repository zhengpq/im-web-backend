import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ErrorCode, errorMessage } from 'src/const/error-code';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        let code = ErrorCode.SUCCESS;
        let dataFinal = data;
        let message = '';
        if (data && data.code !== undefined) {
          code = data.code;
          dataFinal = data.data;
          message = errorMessage[code];
        }
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          code,
          message: message || '',
          data: dataFinal || null,
        };
      }),
    );
  }
}
