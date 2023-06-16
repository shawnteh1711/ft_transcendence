"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const swagger_config_1 = require("./swagger.config");
const passport = require("passport");
const common_1 = require("@nestjs/common");
const connect_pg_simple_1 = require("connect-pg-simple");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: process.env.NEXT_HOST,
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        credentials: true,
    });
    (0, swagger_config_1.setupSwagger)(app);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    const pgPool = new pg.Pool({
        host: process.env.DB_HOST,
        port: 5432,
        database: process.env.DB_USER,
        user: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
    });
    const pgSessionStore = (0, connect_pg_simple_1.default)(ExpressSession);
    const sessionStore = new pgSessionStore({
        pool: pgPool,
        createTableIfMissing: true,
    });
    const sessionOption = ExpressSession({
        name: 'ft_transcendence_session_id',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1 * 24 * 60 * 60 * 100,
        },
    });
    app.use(sessionOption);
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
        console.log('status:', status, '\n', 'path', req.path, '\n');
        next();
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map