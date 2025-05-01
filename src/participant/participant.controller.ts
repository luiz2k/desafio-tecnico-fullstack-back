import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { UserRole } from "src/schemas/user.schema";
import {
  CreateParticipantDto,
  createParticipantSchema,
} from "./dto/create-participant.dto";
import { ParticipantService } from "./participant.service";

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

  @Roles(UserRole.EDITOR)
  async findAll() {
    const participants = await this.participantService.findAll();

    return {
      message: "Busca de participantes realizada com sucesso",
      data: participants,
    };
  }
}
