import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
import { FortyTwoAuthGuard } from '../util/42-auth.guard';
import { User } from 'src/users/decorators/user.decorator';
import { InvalidOtpException } from '../util/invalid_otp_exception';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { JwtAuthGuard } from '../util/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/services/users.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Using 42 Passport
  @UseGuards(FortyTwoAuthGuard)
  @ApiOperation({
    summary: 'login to start your pong game',
  })
  @Get('login')
  async login() {
    console.log('login backend');
  }

  // req.user contains token
  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  async callback(@Req() req: Request, @Res() res: Response): Promise<void> {
    return res.redirect(`${process.env.NEXT_HOST}/setup`);
  }

  // @Get('callback/42-school')
  // async callback42() {
  //   console.log('callback 42 school');
  // }

  // @Get('/callback/42-school')
  // async callback42School(@Req() req: Request, @Res() res: Response) {
  //   console.log('callback 42 school');
  //   return res.redirect(`${process.env.NEXT_HOST}/pong-main`);
  // }

  /* 2FA
  1. enable google authenticator
  2. secret key is used for generating OTP codes
  3. generate API credentials (client id and secret)
  4. QR code generation contain URL with user's secret and info.
  5. Display Qr code to user, user can with google authenticator app from app, get 6 digit OTP
  6. Prompt enter OTP
  7. Compare user entered with generated OTP
  8. If match, user authenticated.
  */

  // @UseGuards(AuthenticatedGuard)

  // COMMAND THIS OUT
  // @Get('2fa')
  // async enableTwoFactorAuth(
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   const otpAuthUrl = await this.authService.generateTwoFactorAuthSecret(
  //     req.user,
  //   );
  //   await this.authService.displayQrCode(res, otpAuthUrl);
  // }

  @Get('2fa')
  async enableTwoFactorAuth(@Req() req: Request) {
    // console.log(req);
    // const otpAuthUrl = await this.authService.generateTwoFactorAuthSecret(
    //   req.user,
    // );
    // await this.authService.displayQrCode(res, otpAuthUrl);
    return await this.authService.generateTwoFactorAuthSecret(req.user);
  }
  // async enableTwoFactorAuth(
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   const otpAuthUrl = await this.authService.generateTwoFactorAuthSecret(
  //     req.user,
  //   );
  //   await this.authService.displayQrCode(res, otpAuthUrl);
  // }

  // JWT containe Header, Payload, Signature
  // @UseGuards(AuthenticatedGuard)
  @Post('otp')
  async verifyOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { otp: string },
    @Query('mode') mode: string,
  ) {
    const isValid = await this.authService.verifyOtp(req.user, body.otp);
    if (isValid) {
      if (mode === '1') {
        await this.authService.storeSecret(req.user);
        const payload = await this.authService.createPayload(req.user);
        const token = await this.authService.createToken(payload);
        res.setHeader('Authorization', `Bearer ${token}`);
        return res.send(token);
      } else {
        return res.send('ok');
      }
    } else {
      throw new InvalidOtpException();
    }
  }

  @Get('session')
  async getAuthSession(
    @Session() session: Record<string, any>,
  ): Promise<Record<string, any>> {
    return await [session, session.id];
    // return ({session: session, sessionId: session.id});
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(AuthGuard('jwt-2fa'))
  @Get('jwt')
  async getJwt() {
    return { msg: 'enter jwt guard' };
  }

  // @UseGuards(AuthenticatedGuard)
  @Get('profile')
  async getProfile(@User() user) {
    const returnUser = await this.authService.getAuthUserProfile(user.id);
    return await returnUser;
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      await this.authService.logout(req.user);
      await this.authService.clearUserSession(req);
      await this.authService.clearUserCookies(res);
      req.logout(() => {
        // console.log('User logged out successfully');
      });
    }
    res.json({ message: 'User logout' });
  }

  @Get('2fa-check')
  async check2fa(@User() user) {
    const userId = user.id;
    const authUser = await this.authService.getAuthUserProfile(userId);
    return { isAuthenticated: authUser.authentication === true };
  }

  // Manual approach
  // @Get('login')
  // login(@Res() res: Response) {
  //   console.log('loging backend');
  //   return (this.authService.redirectTo42OAuth(res));
  // }

  // @Get('callback')
  // async callback(@Query('code') code: string, @Req() req: RequestWithSessionUser, @Res() res: Response) {
  //   try {
  //     console.log(req.user);
  //     const user = await this.authService.authenticateUser(code, req);
  //     console.log("callback");
  //     return res.redirect(`http://localhost:3001/pong-main`);
  //   } catch (error) {
  //     console.log('---------ERRRRRORRRRR--------');
  //     console.error(error)
  //   }
  // }
}
