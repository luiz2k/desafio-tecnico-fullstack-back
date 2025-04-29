import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Influencer } from "src/schemas/influencer.schema";
import { CreateInfluencerDto } from "./dto/create-influencer.dto";

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

    return await this.influencerModel.create(createInfluencerDto);
  }
}
