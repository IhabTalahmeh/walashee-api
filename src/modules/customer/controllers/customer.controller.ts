import { Controller, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Roles } from "src/common/decorators";
import { ERoleType } from "src/common/enum";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Roles(ERoleType.AGENT)
@UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
}))
@Controller('customer')
export class CustomerController {


}