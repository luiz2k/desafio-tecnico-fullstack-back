import {
  Body,
  Controller,
  Delete,
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
import { objectIdSchema } from "src/validations/object-id.validation";
import { CampaignService } from "./campaign.service";
import {
  CreateCampaignParticipantDto,
  createCampaignParticipantSchema,
} from "./dto/create-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard)
@Controller("campaign")
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createCampaignParticipantSchema))
    createCampaignParticipant: CreateCampaignParticipantDto,
  ) {
    const newCampaign = await this.campaignService.create(
      createCampaignParticipant,
    );

    return {
      message: "Camapanha criada com sucesso",
      data: newCampaign,
    };
  }

  @Get()
  @Roles(UserRole.EDITOR)
  async findAll() {
    const campaigns = await this.campaignService.findAll();

    return {
      message: "Busca de campanhas realizada com sucesso",
      data: campaigns,
    };
  }

  @Get(":id")
  @Roles(UserRole.EDITOR)
  async findOne(
    @Param("id", new ZodValidationPipe(objectIdSchema)) id: string,
  ) {
    const campaign = await this.campaignService.findOne(id);

    return {
      message: "Campanha encontrada com sucesso",
      data: campaign,
    };
  }

  @Patch(":id")
  async update(
    @Param("id", new ZodValidationPipe(objectIdSchema)) id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    const campaignUpdated = await this.campaignService.update(
      id,
      updateCampaignDto,
    );

    return {
      message: "Campanha atualizada com sucesso",
      data: campaignUpdated,
    };
  }

  @Delete(":id")
  async delete(@Param("id", new ZodValidationPipe(objectIdSchema)) id: string) {
    const campaignDeleted = await this.campaignService.delete(id);

    return {
      message: "Campanha excluida com sucesso",
      data: campaignDeleted,
    };
  }
}
