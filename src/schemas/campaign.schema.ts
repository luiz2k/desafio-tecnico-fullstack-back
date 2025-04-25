import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Influencer } from "./influencer.schema";

export type CampaignDocument = HydratedDocument<Campaign>;

export enum CampaignStatus {
  OPENING = "opening",
  CLOSED = "closed",
}

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  customer: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: null })
  finishedAt?: Date;

  @Prop({
    required: true,
    enum: CampaignStatus,
    default: CampaignStatus.OPENING,
  })
  status: CampaignStatus;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Influencer" }],
  })
  influencers: Influencer[];
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
