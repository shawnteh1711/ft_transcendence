import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/typeorm/user.entity";
import { UsersService } from 'src/users/services/users.service';

export class SessionSerializer extends PassportSerializer {
    constructor(
       private readonly userService: UsersService
    ) {
        super();
    }

    serializeUser(user: User, done: (err, user: User) => void) {
        done(null, user);
    }
    
    async deserializeUser(user: User, done: (err, user: User) => void) {
        console.log('deserializer user');
        console.log(user.id);
        const userDB = await this.userService.findUsersById(user.id);
        return userDB ? done(null, userDB) : done(null, null);
    }
}
