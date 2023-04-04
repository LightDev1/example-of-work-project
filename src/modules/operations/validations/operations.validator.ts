import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateOperationDto } from '../dto/CreateOperationDto';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsWriteOffBonusesValidConstraint
  implements ValidatorConstraintInterface
{
  constructor() {}

  private errorMessage: string;

  public async validate(value: number, args: ValidationArguments) {
    const operation = args.object as CreateOperationDto;
    const bonusesToWriteOff = value;
    const productCost = operation.product_cost;
    const bonusesOfClient = operation.client_card.balance;
    const bonusPayLimit = operation.client_card.card.bonus_pay_limit;
    const availableBonusesToPay = productCost * (bonusPayLimit / 100);

    const purchaseAmount = operation.purchase_amount;
    const calculatedPurchaseAmount = productCost - bonusesToWriteOff;

    if (bonusesOfClient < bonusesToWriteOff) {
      this.errorMessage =
        'Кол-во бонусов к списанию больше кол-ва бонусов, доступных на карте';
      return false;
    }

    if (bonusesToWriteOff > availableBonusesToPay) {
      this.errorMessage =
        'Кол-во бонусов к списанию больше дозволенного лимита списания бонусов карты';
      return false;
    }

    if (purchaseAmount !== calculatedPurchaseAmount) {
      this.errorMessage =
        'Итоговая стоимость покупки введена была введена неверно';
      return false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return this.errorMessage;
  }
}

export function IsWriteOffBonusesValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsWriteOffBonusesValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsWriteOffBonusesValidConstraint,
    });
  };
}
