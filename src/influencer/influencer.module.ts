import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Influencer, InfluencerSchema } from "src/schemas/influencer.schema";
import { InfluencerController } from "./influencer.controller";
import { InfluencerService } from "./influencer.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Influencer.name, schema: InfluencerSchema },
    ]),
  ],
  controllers: [InfluencerController],
  providers: [InfluencerService],
})
export class InfluencerModule {}
