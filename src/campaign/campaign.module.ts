import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { Campaign, CampaignSchema } from "src/schemas/campaign.schema";
import { Influencer, InfluencerSchema } from "src/schemas/influencer.schema";
import { Participant, ParticipantSchema } from "src/schemas/participant.schema";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "./campaign.service";

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Participant.name, schema: ParticipantSchema },
      { name: Influencer.name, schema: InfluencerSchema },
    ]),
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
