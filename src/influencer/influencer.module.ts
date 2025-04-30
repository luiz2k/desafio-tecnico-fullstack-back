import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Campaign, CampaignSchema } from "src/schemas/campaign.schema";
import { Influencer, InfluencerSchema } from "src/schemas/influencer.schema";
import { InfluencerController } from "./influencer.controller";
import { InfluencerService } from "./influencer.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Influencer.name, schema: InfluencerSchema },
      { name: Campaign.name, schema: CampaignSchema },
    ]),
  ],
  controllers: [InfluencerController],
  providers: [InfluencerService],
})
export class InfluencerModule {}
