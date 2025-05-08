import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Influencer, InfluencerSchema } from "src/schemas/influencer.schema";
import { Participant, ParticipantSchema } from "src/schemas/participant.schema";
import { InfluencerController } from "./influencer.controller";
import { InfluencerService } from "./influencer.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Influencer.name, schema: InfluencerSchema },
      { name: Participant.name, schema: ParticipantSchema },
    ]),
  ],
  controllers: [InfluencerController],
  providers: [InfluencerService],
})
export class InfluencerModule {}
