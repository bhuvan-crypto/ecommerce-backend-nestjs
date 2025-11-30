import { BadRequestException, ValidationError } from '@nestjs/common';

export function validationExceptionFactory(errors: ValidationError[]) {
    console.log(errors);
  const formattedErrors: Record<string, string> = {};

  errors.forEach((err) => {
    if (err.constraints) {
      formattedErrors[err.property] = Object.values(err.constraints).join(', ');
    }
  });


  return new BadRequestException({
    success: false,
    errors: formattedErrors,
    statusCode: 400,
  });
}
