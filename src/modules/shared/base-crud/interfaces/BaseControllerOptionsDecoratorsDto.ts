export class BaseControllerOptionsDecoratorsDto {
  createOne?: (ClassDecorator | MethodDecorator | PropertyDecorator)[];
  createMany?: (ClassDecorator | MethodDecorator | PropertyDecorator)[];
  getMany?: (ClassDecorator | MethodDecorator | PropertyDecorator)[];
  getOne?: (ClassDecorator | MethodDecorator | PropertyDecorator)[];
  updateOne?: (ClassDecorator | MethodDecorator | PropertyDecorator)[];
  deleteOne?: (ClassDecorator | MethodDecorator | PropertyDecorator)[];
}
