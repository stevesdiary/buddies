import { PrismaModule } from "@app/prisma/prisma.module";
import { AuthService } from "./auth.service";

@module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}