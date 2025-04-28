import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<unknown>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "Erro na validação dos dados",
          data: {
            type: metadata.type,
            errors: error.flatten().fieldErrors,
          },
        });
      }

      throw new BadRequestException("Erro na validação dos dados");
    }
  }
}
