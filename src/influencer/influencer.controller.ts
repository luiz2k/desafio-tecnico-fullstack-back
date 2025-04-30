import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { UserRole } from "src/schemas/user.schema";
import { objectIdSchema } from "../validations/object-id.validation";
import {
  CreateInfluencerDto,
  createInfluencerSchema,
} from "./dto/create-influencer.dto";
import {
  UpdateInfluencerDto,
  updateInfluencerSchema,
} from "./dto/update-influencer.dto";
import { InfluencerService } from "./influencer.service";

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard)
@Controller("influencer")
export class InfluencerController {
  constructor(private readonly influencerService: InfluencerService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createInfluencerSchema))
    createInfluencerDto: CreateInfluencerDto,
  ) {
    return this.influencerService.create(createInfluencerDto);
  }

  @Roles(UserRole.EDITOR)
  @Get()
  findAll() {
    return this.influencerService.findAll();
  }

  @Roles(UserRole.EDITOR)
  @Patch(":id")
  update(
    @Param("id", new ZodValidationPipe(objectIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateInfluencerSchema))
    updateInfluencerDto: UpdateInfluencerDto,
  ) {
    return this.influencerService.update(id, updateInfluencerDto);
  }
}
