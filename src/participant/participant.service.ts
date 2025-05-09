import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Participant } from "src/schemas/participant.schema";
import { CreateParticipantDto } from "./dto/create-participant.dto";
import { UpdateParticipantDto } from "./dto/update-participant.dto";
import { Campaign } from "src/schemas/campaign.schema";
import { Influencer } from "src/schemas/influencer.schema";

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name)
    private readonly participantModel: Model<Participant>,
    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<Campaign>,
    @InjectModel(Influencer.name)
    private readonly influencerModel: Model<Influencer>,
  ) {}

  async create(createParticipantDto: CreateParticipantDto) {
    const participantExists =
      await this.participantModel.findOne(createParticipantDto);

    if (participantExists) {
      throw new ConflictException("Participante já cadastrado");
    }

    return await this.participantModel.create(createParticipantDto);
  }

  async createMany(campaignId: string, influencers: string[]) {
    const campaignExists = await this.campaignModel.findOne({
      _id: campaignId,
    });

    if (!campaignExists) {
      throw new NotFoundException("Campanha não encontrada");
    }

    if (influencers.length === 0) {
      throw new ConflictException("Nenhum influenciador foi selecionado");
    }

    const existingIfluencers: string[] = [];

    for (const influencerId of influencers) {
      const influencerExists = await this.influencerModel.findOne({
        influencer: influencerId,
      });

      if (!influencerExists) {
        existingIfluencers.push(influencerId);
      }
    }

    const unregisteredParticipants: string[] = [];

    for (const influencerId of existingIfluencers) {
      const participantExists = await this.participantModel.findOne({
        campaign: campaignId,
        influencer: influencerId,
      });

      if (!participantExists) {
        unregisteredParticipants.push(influencerId);
      }
    }

    if (unregisteredParticipants.length > 0) {
      return await this.participantModel.insertMany(
        unregisteredParticipants.map((influencerId) => ({
          campaign: campaignId,
          influencer: influencerId,
        })),
      );
    }
  }

  async findAll() {
    return await this.participantModel.find();
  }

  async findByCampaignId(id: string) {
    const participantExists = await this.participantModel
      .find({
        campaign: id,
      })
      .populate("influencer");

    if (!participantExists) {
      throw new ConflictException("Participante não encontrado");
    }

    return participantExists;
  }

  async update(id: string, updateParticipantDto: UpdateParticipantDto) {
    const participantExists = await this.participantModel.findOne({ _id: id });

    if (!participantExists) {
      throw new ConflictException("Participante não encontrado");
    }

    this.participantModel.updateOne({ _id: id }, updateParticipantDto);

    return this.participantModel.findOne({ _id: id });
  }

  async delete(campaignId: string, influencerId: string) {
    const participantExists = await this.participantModel.findOne({
      campaign: campaignId,
      influencer: influencerId,
    });

    if (!participantExists) {
      throw new ConflictException("Participante não encontrado na campanha");
    }

    return await this.participantModel.deleteOne({
      campaign: campaignId,
      influencer: influencerId,
    });
  }
}
