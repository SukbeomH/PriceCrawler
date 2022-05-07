import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './apis/auth/auth.module';
import { BoardModule } from './apis/board/board.module';
import { CartModule } from './apis/cart/cart.module';
import { CategoryModule } from './apis/category/category.module';
import { CommentModule } from './apis/comment/comment.module';
import { DealCommentModule } from './apis/dealComment/dealComment.module';
import { PointTransactionModule } from './apis/pointTransaction/pointTransaction.module';
import { ProductModule } from './apis/product/product.module';
import { UserModule } from './apis/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './apis/file/file.module';
import { ImageModule } from './apis/image/image.module';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        AuthModule,
        BoardModule,
        CartModule,
        CategoryModule,
        CommentModule,
        DealCommentModule,
        FileModule,
        PointTransactionModule,
        ProductModule,
        ImageModule,
        UserModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'src/commons/graphql/schema.gql',
            context: ({ req, res }) => ({ req, res }),
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'my-database',
            // host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'myDocker',
            // database: 'localhost',
            entities: [__dirname + '/apis/**/*.entity.*'],
            synchronize: true,
            logging: true,
            retryDelay: 5000,
            retryAttempts: 15,
            keepConnectionAlive: true,
            autoLoadEntities: true,
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register<RedisClientOptions>({
            store: redisStore,
            url: 'redis://my-redis:6379',
            isGlobal: true,
        }),
    ],
})
export class AppModule {}
