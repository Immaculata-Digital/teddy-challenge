import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro interno no servidor';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = res.message || exception.message;
      error = res.error || exception.name;
    } else if (exception instanceof Error) {
      // Tratamento de erros específicos do TypeORM se necessário
      if (exception.message.includes('duplicate key value')) {
        status = HttpStatus.CONFLICT;
        message = 'Já existe um registro com estes dados.';
        error = 'Conflict';
      }
      
      // Em desenvolvimento, podemos querer ver o erro real se não for HttpException
      if (process.env.NODE_ENV === 'development') {
        console.error(exception);
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message, // Pega a primeira mensagem de validação se for array
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
