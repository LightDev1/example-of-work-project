import { UnauthorizedException } from '@nestjs/common';

export class AppUnauthorizedException extends UnauthorizedException {
    constructor() {
        super('Ошибка авторизации');
    }
}