import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { CampaignModule } from "./campaign/campaign.module";
import { InfluencerModule } from "./influencer/influencer.module";
import { ParticipantModule } from "./participant/participant.module";
import { UserModule } from "./user/user.module";
import { envSchema } from "./validations/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
    }),
    AuthModule,
    UserModule,
    InfluencerModule,
    CampaignModule,
    ParticipantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
