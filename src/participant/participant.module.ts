import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Campaign, CampaignSchema } from "src/schemas/campaign.schema";
import { Influencer, InfluencerSchema } from "src/schemas/influencer.schema";
import { Participant, ParticipantSchema } from "src/schemas/participant.schema";
import { ParticipantController } from "./participant.controller";
import { ParticipantService } from "./participant.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
      { name: Campaign.name, schema: CampaignSchema },
      { name: Influencer.name, schema: InfluencerSchema },
    ]),
  ],
  controllers: [ParticipantController],
  providers: [ParticipantService],
})
export class ParticipantModule {}
