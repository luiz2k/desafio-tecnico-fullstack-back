import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type InfluencerDocument = HydratedDocument<Influencer>;

@Schema()
export class Influencer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  social_network: string;

  @Prop({ required: true })
  followers: number;
}

export const InfluencerSchema = SchemaFactory.createForClass(Influencer);
