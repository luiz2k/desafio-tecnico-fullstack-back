import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  async create(
    @Body(new ZodValidationPipe(createInfluencerSchema))
    createInfluencerDto: CreateInfluencerDto,
  ) {
    const newInfluencer =
      await this.influencerService.create(createInfluencerDto);

    return {
      message: "Influenciador cadastrado com sucesso",
      data: newInfluencer,
    };
  }

  @Roles(UserRole.EDITOR)
  @Get()
  async findAll(
    @Query("name") name?: string,
    @Query("social_network") social_network?: string,
  ) {
    const influencers = await this.influencerService.findAll(
      name,
      social_network,
    );

    return {
      message: "Busca de influenciadores realizada com sucesso",
      data: influencers,
    };
  }

  @Roles(UserRole.EDITOR)
  @Patch(":id")
  async update(
    @Param("id", new ZodValidationPipe(objectIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateInfluencerSchema))
    updateInfluencerDto: UpdateInfluencerDto,
  ) {
    const influencerUpdated = await this.influencerService.update(
      id,
      updateInfluencerDto,
    );

    return {
      message: "Influenciador atualizado com sucesso",
      data: influencerUpdated,
    };
  }

  @Delete(":id")
  async delete(@Param("id", new ZodValidationPipe(objectIdSchema)) id: string) {
    const influencerDeleted = await this.influencerService.delete(id);

    return {
      message: "Influenciador excluído com sucesso",
      data: influencerDeleted,
    };
  }
}
