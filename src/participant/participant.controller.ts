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
import {
  CreateParticipantDto,
  createParticipantSchema,
} from "./dto/create-participant.dto";
import {
  UpdateParticipantDto,
  updateParticipantSchema,
} from "./dto/update-participant.dto";
import { ParticipantService } from "./participant.service";
import { z } from "zod";

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard)
@Controller("participant")
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createParticipantSchema))
    createParticipantDto: CreateParticipantDto,
  ) {
    const newParticipant = this.participantService.create(createParticipantDto);

    return {
      message: "Participante cadastrado com sucesso",
      data: newParticipant,
    };
  }

  @Post("bulk/:campaignId")
  async createMany(
    @Param("campaignId", new ZodValidationPipe(objectIdSchema))
    campaignId: string,
    @Body(new ZodValidationPipe(z.array(objectIdSchema)))
    influencers: string[],
  ) {
    const newParticipants = await this.participantService.createMany(
      campaignId,
      influencers,
    );

    return {
      message: "Participantes cadastrados com sucesso",
      data: newParticipants,
    };
  }

  @Roles(UserRole.EDITOR)
  @Get()
  async findAll() {
    const participants = await this.participantService.findAll();

    return {
      message: "Busca de participantes realizada com sucesso",
      data: participants,
    };
  }

  @Roles(UserRole.EDITOR)
  @Get(":id")
  async findByCampaignId(
    @Param("id", new ZodValidationPipe(objectIdSchema)) id: string,
  ) {
    const participants = await this.participantService.findByCampaignId(id);

    return {
      message: "Participantes da campanha encontrados com sucesso",
      data: participants,
    };
  }

  @Roles(UserRole.EDITOR)
  @Patch(":id")
  update(
    @Param("id", new ZodValidationPipe(objectIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateParticipantSchema))
    updateInfluencerDto: UpdateParticipantDto,
  ) {
    const participantUpdated = this.participantService.update(
      id,
      updateInfluencerDto,
    );

    return {
      message: "Participante atualizado com sucesso",
      data: participantUpdated,
    };
  }

  @Delete(":campaignId/:influencerId")
  async delete(
    @Param("campaignId", new ZodValidationPipe(objectIdSchema))
    campaignId: string,
    @Param("influencerId", new ZodValidationPipe(objectIdSchema))
    influencerId: string,
  ) {
    const participantDeleted = await this.participantService.delete(
      campaignId,
      influencerId,
    );

    return {
      message: "Participante excluido da campanha com sucesso",
      data: participantDeleted,
    };
  }
}
