import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// import { VerifyCallback } from "passport-jwt";
// import { Strategy } from 'passport-42';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { AuthService } from '../services/auth.service';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.AUTH_CALLBACK,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const authUser = await this.authService.findOneOrCreate(profile);
    // if (authUser.online) {
    // User is already logged in, prevent the login
    // done(null, false, { message: 'User is already logged in' });
    // } else {
    done(null, authUser);
    // }
  }

  // async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
  //     const user: AuthenticatedUser = {
  //         id: null,
  //         intra_uid : profile.id,
  //         username : profile.username,
  //         avatar : profile._json.image.link,
  //         online: true,
  //         accessToken: accessToken,
  //         refreshToken: refreshToken,
  //     };
  //     let existingUser = await this.authService.findOneOrCreate(profile);
  //     if (!existingUser.online)
  //         existingUser = await this.userService.updateUser(existingUser.id, { online: true });
  //     const newUser = {
  //             ...user,
  //             ...existingUser,
  //         };
  //     done(null, newUser);
  // }
}
