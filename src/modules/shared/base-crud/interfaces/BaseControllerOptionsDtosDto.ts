export interface BaseControllerOptionsDtosDto {
  createOneDto?: { new (): any };
  createManyDto?: { new (): any };
  updateOneDto?: { new (): any };
}
