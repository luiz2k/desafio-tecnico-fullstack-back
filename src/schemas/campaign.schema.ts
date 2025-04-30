import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CampaignDocument = HydratedDocument<Campaign>;

export enum CampaignStatus {
  OPENING = "opening",
  CLOSED = "closed",
}

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true, unique: true })
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
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
