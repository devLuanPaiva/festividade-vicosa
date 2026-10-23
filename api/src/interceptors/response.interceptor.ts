import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { map, type Observable } from 'rxjs';
import {
  buildPageUrl,
  buildPaginatedResponse,
  parsePageWindow,
  readCollection,
  type PaginatedResponse,
} from './pagination';

export interface SuccessResponse {
  status: 'success';
  result: unknown;
}

function buildBaseUrl(request: Request): string {
  return `${request.protocol}://${request.get('host') ?? ''}${request.path}`;
}

function wrapResponse(data: unknown, request: Request): SuccessResponse | PaginatedResponse {
  const collection = readCollection(data);
  if (!collection) {
    return { status: 'success', result: data };
  }

  const query = request.query as Record<string, unknown>;
  const baseUrl = buildBaseUrl(request);
  return buildPaginatedResponse(collection, parsePageWindow(query), (page) =>
    buildPageUrl(baseUrl, query, page),
  );
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse | PaginatedResponse> {
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(map((data: unknown) => wrapResponse(data, request)));
  }
}
