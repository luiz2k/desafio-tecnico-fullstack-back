import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { UserRole } from "src/schemas/user.schema";
import { CampaignService } from "./campaign.service";
import {
  CreateCampaignDto,
  createCampaignSchema,
} from "./dto/create-campaign.dto";
import { objectIdSchema } from "src/validations/object-id.validation";

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard)
@Controller("campaign")
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createCampaignSchema))
    createCampaignDto: CreateCampaignDto,
  ) {
    return this.campaignService.create(createCampaignDto);
  }

  @Get()
  @Roles(UserRole.EDITOR)
  findAll() {
    return this.campaignService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.EDITOR)
  findOne(@Param("id", new ZodValidationPipe(objectIdSchema)) id: string) {
    return this.campaignService.findOne(id);
  }

  @Delete(":id")
  delete(@Param("id", new ZodValidationPipe(objectIdSchema)) id: string) {
    return this.campaignService.delete(id);
  }
}
