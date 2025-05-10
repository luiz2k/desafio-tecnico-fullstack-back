import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Campaign, CampaignStatus } from "src/schemas/campaign.schema";
import { Influencer } from "src/schemas/influencer.schema";
import { Participant } from "src/schemas/participant.schema";
import { CreateCampaignParticipantDto } from "./dto/create-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private readonly campaignModel: Model<Campaign>,
    @InjectModel(Participant.name)
    private readonly participantModel: Model<Participant>,
    @InjectModel(Influencer.name)
    private readonly influencerModel: Model<Influencer>,
  ) {}

  async create(createCampaignParticipant: CreateCampaignParticipantDto) {
    const campaignExists = await this.campaignModel.findOne({
      title: createCampaignParticipant.campaign.title,
    });

    if (campaignExists) {
      throw new ConflictException("Já existe uma campanha com esse título");
    }

    if (
      createCampaignParticipant.campaign.startedAt >=
      createCampaignParticipant.campaign.finishedAt
    ) {
      throw new ConflictException(
        "A data de fim deve ser maior que a data de inicio",
      );
    }

    const createdCampaign = await this.campaignModel.create(
      createCampaignParticipant.campaign,
    );

    // Remove os influenciadores duplicados
    const influencersWithoutDuplicates = new Set(
      createCampaignParticipant.participants,
    );

    // Se a lista de participantes existir, insira eles na campanha criada
    if (createCampaignParticipant.participants) {
      for (const participant of influencersWithoutDuplicates) {
        const influencerExists = await this.influencerModel.findOne({
          _id: participant,
        });

        if (influencerExists) {
          await this.participantModel.create({
            campaign: createdCampaign._id,
            influencer: participant,
          });
        }
      }
    }

    return createdCampaign;
  }

  async findAll(title?: string, status?: CampaignStatus) {
    const filter = {};

    if (title) {
      filter["title"] = { $regex: title, $options: "i" };
    }

    if (status) {
      filter["status"] = status;
    }

    return await this.campaignModel.find(filter);
  }

  async findOne(id: string) {
    const campaignExists = await this.campaignModel.findOne({ _id: id });

    if (!campaignExists) {
      throw new NotFoundException("Campanha não encontrada");
    }

    return campaignExists;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    const campaignExists = await this.campaignModel.findOne({ _id: id });

    if (!campaignExists) {
      throw new NotFoundException("Campanha não encontrada");
    }

    // Verifica quais registros do influenciador devem ser atualizados
    const updatePayload: UpdateCampaignDto = {};

    for (const key of Object.keys(updateCampaignDto)) {
      let oldValue = campaignExists[key] as string | number | Date;
      let newValue = updateCampaignDto[key] as string | number | Date;

      // Verifica se é um objeto, pois ele salva no banco de dados como objeto
      if (typeof oldValue === "object") {
        oldValue = new Date(oldValue).getTime();
        newValue = new Date(newValue).getTime();
      }

      if (newValue !== undefined && newValue !== oldValue) {
        updatePayload[key] = newValue;
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      throw new ConflictException("Pelo menos um campo deve ser atualizado");
    }

    if (updatePayload.title) {
      const campaignExists = await this.campaignModel.findOne({
        title: updatePayload.title,
      });

      if (campaignExists) {
        throw new ConflictException("Já existe uma campanha com esse título");
      }
    }

    if (updatePayload.startedAt && !updatePayload.finishedAt) {
      if (updatePayload.startedAt >= campaignExists.finishedAt) {
        throw new ConflictException(
          "A data de início deve ser menor que a data de fim",
        );
      }
    }

    if (updatePayload.finishedAt && !updatePayload.startedAt) {
      if (updatePayload.finishedAt <= campaignExists.startedAt) {
        throw new ConflictException(
          "A data de fim deve ser maior que a data de inicio",
        );
      }
    }

    if (
      updatePayload.startedAt &&
      updatePayload.finishedAt &&
      updatePayload.startedAt >= updatePayload.finishedAt
    ) {
      throw new ConflictException(
        "A data de fim deve ser maior que a data de inicio",
      );
    }

    await this.campaignModel.updateOne({ _id: id }, updatePayload);

    return await this.campaignModel.findOne({ _id: id });
  }

  async delete(id: string) {
    const campaignExists = await this.campaignModel.findOne({ _id: id });

    if (!campaignExists) {
      throw new NotFoundException("Campanha não encontrada");
    }

    return await this.campaignModel.deleteOne({ _id: id });
  }
}
