import validator from 'validator';
import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function ValidationString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidationString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (
            value === undefined ||
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
            ] || `${propertyName} only a-z,A-Z,0-9`
          );
        },
      },
    });
  };
}
