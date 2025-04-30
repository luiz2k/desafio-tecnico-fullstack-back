import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Campaign } from "src/schemas/campaign.schema";
import { CreateCampaignDto } from "./dto/create-campaign.dto";

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private readonly campaignModel: Model<Campaign>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto) {
    const campaignExists = await this.campaignModel.findOne({
      title: createCampaignDto.title,
    });

    if (campaignExists) {
      throw new ConflictException("Já existe uma campanha com esse título");
    }

    return {
      message: "Camapanha criada com sucesso",
      data: await this.campaignModel.create(createCampaignDto),
    };
  }

  async findAll() {
    return {
      message: "Busca de campanhas realizada com sucesso",
      data: await this.campaignModel.find(),
    };
  }

  async findOne(id: string) {
    const campaignExists = await this.campaignModel.findOne({ _id: id });

    if (!campaignExists) {
      throw new NotFoundException("Campanha não encontrada");
    }

    return {
      message: "Campanha encontrada com sucesso",
      data: campaignExists,
    };
  }
}
