import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Participant } from "src/schemas/participant.schema";
import { CreateParticipantDto } from "./dto/create-participant.dto";
import { UpdateParticipantDto } from "./dto/update-participant.dto";

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name)
    private readonly participantModel: Model<Participant>,
  ) {}

  async create(createParticipantDto: CreateParticipantDto) {
    const participantExists =
      await this.participantModel.findOne(createParticipantDto);

    if (participantExists) {
      throw new ConflictException("Participante já cadastrado");
    }

    return await this.participantModel.create(createParticipantDto);
  }

  async findAll() {
    return await this.participantModel.find();
  }

  async update(id: string, updateParticipantDto: UpdateParticipantDto) {
    const participantExists = await this.participantModel.findOne({ _id: id });

    if (!participantExists) {
      throw new ConflictException("Participante não encontrado");
    }

    this.participantModel.updateOne({ _id: id }, updateParticipantDto);

    return this.participantModel.findOne({ _id: id });
  }
}
