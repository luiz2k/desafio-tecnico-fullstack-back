import { Module } from "@nestjs/common";
import { Participant, ParticipantSchema } from "src/schemas/participant.schema";
import { ParticipantController } from "./participant.controller";
import { ParticipantService } from "./participant.service";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
    ]),
  ],
  controllers: [ParticipantController],
  providers: [ParticipantService],
})
export class ParticipantModule {}
