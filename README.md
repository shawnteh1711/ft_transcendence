# transcendence

This is a project of 42 to create a pong contest website .

# Setting postgres

1. Install postgress, pgadmin4 and npm install typeorm.
2. import typeorm into app.module.ts in backend
3. Create entity, services and controller, dtos
4. initdb -D path to store data directory

```
npm install --save @nestjs/typeorm typeorm pg
```

# Protected against SQL injections (parameteriezed quaries)

```
 @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }
```

# Server-side validation for forms and any user input (DTO, class-validator decoratora)

```
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserController {
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    // Validate user input
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Save user to database
    await this.userRepository.save(createUserDto);
  }
}
```

#init PostresSQL database cluster

```
$ initdb -D /path/to/data/directory

```

# Idead for nextjs authentication to get cookies

```
import { type NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const authorization = req.cookies.get('authorization')?.value
  return fetch('https://backend-api.com/api/protected', {
    method: req.method,
    headers: {
      authorization,
    },
    redirect: 'manual',
  })
}
```

#login page idea

1. soundtrack when landing
2. backquotes atari pong quote?
3. shoule be simple minimalistic

# check for local network

`ipconfig getifaddr en0`

# spectator

if two user start a game, emit room Id and player from backend to the both user friends
all their friend can view the game in friend list when looking at the user profile

# Further improvement

1. More security on backend api instead just cookies header
2. Scailing of game graphics and client prediction to support multiple game so that it is not laggy
3. More user authentication using access token and refresh token
4. 2fa for sign in
5. leave mid game should count lose

# Learning outcome

1. save state using zustand in nextjs
2. UseContext to save state and access child component
3. Using socket to achieve real time communication between frontend and backend
4. Port forwading for hosting
5. Docker to wrap whole project

# Credit

1. [Jokeroo, Game Dev](https://github.com/joekeroo)
2. [JordieYen, Chat Dev](https://github.com/JordieYen)
3. [Zer Lee, Design and security](https://github.com/sirhcofe)

# Reference

1. [Postgresql with nestjs](https://blog.devgenius.io/setting-up-nestjs-with-postgresql-ac2cce9045fe)
2. [TypeOrmCoreModule dependencies issue](https://www.youtube.com/watch?v=O0fzKqswwJs)
3. [42 API](https://api.intra.42.fr/apidoc/guides/web_application_flow)
4. [Notion](https://www.notion.so/a615f8244a264c3d8cd42a9a0159d34d?v=b19aec694fe74401af8ad859f3b31a15&p=021309324ca745a0ac61fac8f57e57a9&pm=s)
5. [JWT Passport Strategy](https://betterprogramming.pub/jwt-and-passport-jwt-strategy-for-your-nestjs-rest-api-project-cafa9dd59890)
6. [42 Passport Strategy](https://github.com/ykoh42/42OAuth-NestJS)
7. [Subject](https://cdn.intra.42.fr/pdf/pdf/81790/en.subject.pdf)
8. [Figma](https://www.figma.com/file/TVlO5hWLAHQM1S8YVD1oSv/Prototype-2?type=design&node-id=0-1&t=pR2aZ37d1wnm)
