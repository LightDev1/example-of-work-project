import {
  applyDecorators,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import JwtAuthenticationGuard from 'src/modules/auth/guards/jwt.guard';
import { PermissionsGuard } from 'src/modules/permissions/guards/permissions.guard';
import { ApiListDetailedResponseDto } from 'src/modules/shared';
import { ApiPaginateQuery } from '../../decorators/pagination-query.decorator';
import { ExcludeRoute } from '../decorators/exclude-route.decorator';
import { PaginationInterceptor } from '../interceptors/pagination.interceptor';
import { BaseControllerOptionsDto } from '../interfaces/BaseControllerOptionsDto';
import { BaseCrudService } from '../services/base-crud.service';

export function getBaseController<T>(
  classType: { new (): T },
  options?: BaseControllerOptionsDto,
): any {
  const createOneDto = options?.dtos?.createOneDto
    ? options?.dtos.createOneDto
    : classType;
  const createManyDto = options?.dtos?.createManyDto
    ? options?.dtos.createManyDto
    : classType;
  const updateOneDto = options?.dtos?.updateOneDto
    ? options?.dtos.updateOneDto
    : classType;
  const decoratorsOfRoute = {
    createOne: options?.decorators?.createOne || [],
    createMany: options?.decorators?.createMany || [],
    getMany: options?.decorators?.getMany || [],
    getOne: options?.decorators?.getOne || [],
    updateOne: options?.decorators?.updateOne || [],
    deleteOne: options?.decorators?.deleteOne || [],
  };
  const apiTags = options?.apiTags || classType.name;

  if (options.exclude && options.exclude.length) {
    options.exclude.forEach((route) =>
      decoratorsOfRoute[route].push(ExcludeRoute(), ApiExcludeEndpoint()),
    );
  }

  @ApiTags(apiTags)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthenticationGuard, PermissionsGuard)
  abstract class BaseController {
    constructor(private readonly service: BaseCrudService<T>) {}

    @applyDecorators(...decoratorsOfRoute.createOne)
    @ApiBody({ type: createOneDto })
    @ApiOperation({ summary: options?.swagger?.createOne?.summary })
    @ApiResponse({
      type: () => classType,
      schema: options?.swagger?.createOne?.schema,
    })
    @Post()
    //@ts-ignore
    public createOne(@Body() data: createOneDto): Promise<T> {
      return this.service.create(data);
    }

    @applyDecorators(...decoratorsOfRoute.createMany)
    @ApiOperation({ summary: options?.swagger?.createMany?.summary })
    @ApiBody({ type: () => [createManyDto], isArray: true })
    @ApiResponse({
      type: () => classType,
      isArray: true,
      schema: options?.swagger?.createMany?.schema,
    })
    @Post('/bulk')
    //@ts-ignore
    public createMany(@Body() data: createManyDto): Promise<T[]> {
      //@ts-ignore
      return this.service.createMany(data);
    }

    @applyDecorators(...decoratorsOfRoute.getMany)
    @UseInterceptors(new PaginationInterceptor<T>())
    @ApiPaginateQuery()
    @ApiOperation({ summary: options?.swagger?.getMany?.summary })
    @ApiListDetailedResponseDto(classType, {
      schema: options?.swagger?.getMany?.schema,
    })
    @Get()
    public getMany(@Paginate() query: PaginateQuery): Promise<Paginated<T>> {
      //@ts-ignore
      return this.service.getMany(query);
    }

    @applyDecorators(...decoratorsOfRoute.getOne)
    @ApiOperation({ summary: options?.swagger?.getOne?.summary })
    @ApiParam({ type: 'string', name: 'id' })
    @ApiResponse({
      type: classType,
      schema: options?.swagger?.getOne?.schema,
    })
    @Get(':id')
    public getOne(@Param('id') id: number): Promise<T> {
      return this.service.getOne(id);
    }

    @applyDecorators(...decoratorsOfRoute.updateOne)
    @ApiOperation({ summary: options?.swagger?.updateOne?.summary })
    @ApiBody({ type: () => updateOneDto })
    @ApiParam({ type: 'string', name: 'id' })
    @ApiResponse({
      type: () => classType,
      schema: options?.swagger?.updateOne?.schema,
    })
    @Patch(':id')
    public updateOne(
      @Param() id: number,
      @Body() data: Partial<typeof updateOneDto>,
    ): Promise<T> {
      return this.service.update(id, data);
    }

    @applyDecorators(...decoratorsOfRoute.deleteOne)
    @ApiOperation({ summary: options?.swagger?.deleteOne?.summary })
    @ApiParam({ type: 'string', name: 'id' })
    @Delete(':id')
    public deleteOne(@Param('id') id: number): Promise<void> {
      return this.service.delete(id);
    }
  }

  return BaseController;
}
