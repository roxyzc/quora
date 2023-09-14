import validator from 'validator';
import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function ValidationUsername(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidationUsername',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (
            !validator.isAlphanumeric(validator.blacklist(value, ' ')) ||
            validator.trim(value).replace(/\s+/g, ' ') !== value
          ) {
            return false;
          }
          return true;
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return (
            (validationArguments.object as any)[
              `${validationArguments.property}_error`
            ] || 'Username only a-z,A-Z,0-9'
          );
        },
      },
    });
  };
}
