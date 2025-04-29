import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { UserRole } from "src/schemas/user.schema";
import {
  CreateInfluencerDto,
  createInfluencerSchema,
} from "./dto/create-influencer.dto";
import { InfluencerService } from "./influencer.service";

@Controller("influencer")
export class InfluencerController {
  constructor(private readonly influencerService: InfluencerService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body(new ZodValidationPipe(createInfluencerSchema))
    createInfluencerDto: CreateInfluencerDto,
  ) {
    return this.influencerService.create(createInfluencerDto);
  }
}
