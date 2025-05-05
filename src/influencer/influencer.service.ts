import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Campaign } from "src/schemas/campaign.schema";
import { Influencer } from "src/schemas/influencer.schema";
import { CreateInfluencerDto } from "./dto/create-influencer.dto";
import { UpdateInfluencerDto } from "./dto/update-influencer.dto";

@Injectable()
export class InfluencerService {
  constructor(
    @InjectModel(Influencer.name)
    private readonly influencerModel: Model<Influencer>,
    @InjectModel(Campaign.name) private readonly campaignModel: Model<Campaign>,
  ) {}

  async create(createInfluencerDto: CreateInfluencerDto) {
    const influencerExists = await this.influencerModel.findOne({
      social_network: createInfluencerDto.social_network,
    });

    if (influencerExists) {
      throw new ConflictException("Influencer já cadastrado");
    }

    return await this.influencerModel.create(createInfluencerDto);
  }

  async findAll() {
    return await this.influencerModel.find();
  }

  async update(id: string, updateInfluencerDto: UpdateInfluencerDto) {
    const influencerExists = await this.influencerModel.findOne({
      _id: id,
    });

    if (!influencerExists) {
      throw new NotFoundException("Influenciador não encontrado");
    }

    // Verifica quais registros do influenciador devem ser atualizados
    const updatePayload: UpdateInfluencerDto = {};

    for (const key of Object.keys(updateInfluencerDto)) {
      const oldValue = influencerExists[key] as string | number | undefined;
      const newValue = updateInfluencerDto[key] as string | number | undefined;

      if (newValue !== undefined && newValue !== oldValue) {
        updatePayload[key] = newValue;
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      throw new ConflictException("Pelo menos um campo deve ser atualizado");
    }

    if (updatePayload.social_network) {
      const socialNetworkExists = await this.influencerModel.findOne({
        social_network: updatePayload.social_network,
      });

      if (socialNetworkExists) {
        throw new ConflictException("Rede social informada já está cadastrada");
      }
    }

    await this.influencerModel.updateOne({ _id: id }, updatePayload);

    return await this.influencerModel.findOne({ _id: id });
  }

  async delete(id: string) {
    const influencerExists = await this.influencerModel.findOne({
      _id: id,
    });

    if (!influencerExists) {
      throw new NotFoundException("Influenciador não encontrado");
    }

    await this.campaignModel.updateMany(
      { influencers: id },
      { $pull: { influencers: id } },
    );

    return await this.influencerModel.deleteOne({ _id: id });
  }
}
