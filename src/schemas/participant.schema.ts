import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Influencer } from "./influencer.schema";
import { Campaign } from "./campaign.schema";

export type ParticipantDocument = HydratedDocument<Participant>;

@Schema()
export class Participant {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Campaign.name })
  campaign: Campaign;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Influencer.name })
  influencer: Influencer;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);

ParticipantSchema.index({ campaign: 1, influencer: 1 }, { unique: true });
