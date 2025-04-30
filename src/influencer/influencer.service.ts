import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Influencer } from "src/schemas/influencer.schema";
import { CreateInfluencerDto } from "./dto/create-influencer.dto";
import { UpdateInfluencerDto } from "./dto/update-influencer.dto";

@Injectable()
export class InfluencerService {
  constructor(
    @InjectModel(Influencer.name)
    private readonly influencerModel: Model<Influencer>,
  ) {}

  async create(createInfluencerDto: CreateInfluencerDto) {
    const influencerExists = await this.influencerModel.findOne({
      social_network: createInfluencerDto.social_network,
    });

    if (influencerExists) {
      throw new ConflictException("Influencer já cadastrado");
    }

    const newInfluencer =
      await this.influencerModel.create(createInfluencerDto);

    return {
      message: "Influenciador cadastrado com sucesso",
      data: newInfluencer,
    };
  }

  async update(id: string, updateInfluencerDto: UpdateInfluencerDto) {
    const influencerExists = await this.influencerModel.findOne({
      _id: id,
    });

    if (!influencerExists) {
      throw new NotFoundException("Influenciador não encontrado");
    }

    const socialNetworkExists = await this.influencerModel.findOne({
      social_network: updateInfluencerDto.social_network,
    });

    if (socialNetworkExists) {
      throw new ConflictException("social_network já cadastrada");
    }

    await this.influencerModel.updateOne({ _id: id }, updateInfluencerDto);

    return {
      message: "Influenciador atualizado com sucesso",
      data: await this.influencerModel.findOne({ _id: id }),
    };
  }
}
