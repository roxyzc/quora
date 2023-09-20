import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import validator from 'validator';

export function ValidationArray(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidationArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: { title?: string }) {
          let i = 0;

          if (value && value.title === undefined) {
            return false;
          }

          if (
            value.title !== undefined &&
            (!validator.isAlphanumeric(validator.blacklist(value.title, ' ')) ||
              validator.trim(value.title).replace(/\s+/g, ' ') !==
                value.title ||
              i > 5)
          ) {
            return false;
          }

          i++;
          return true;
        },
        defaultMessage(object: ValidationArguments) {
          return (
            (object.object as any)[`${object.property}_error`] ||
            `${propertyName} invalid`
          );
        },
      },
    });
  };
}
