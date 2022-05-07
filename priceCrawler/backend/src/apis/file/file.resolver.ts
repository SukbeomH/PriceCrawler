import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { UseGuards } from '@nestjs/common';
import { GqlAuthEmailGuard } from 'src/commons/auth/graphql-auth.guard';

@Resolver()
export class FileResolver {
    constructor(private readonly fileService: FileService) {}

    // @UseGuards(GqlAuthEmailGuard)
    @Mutation(() => [String])
    uploadFileMany(
        @Args({ name: 'files', type: () => [GraphQLUpload] })
        files: FileUpload[],
    ) {
        // console.log(file);
        return this.fileService.upload({ files });
    }
}
