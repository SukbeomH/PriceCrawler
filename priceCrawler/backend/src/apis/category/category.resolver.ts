import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Resolver()
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) {}

    @Query(() => [Category])
    fetchCategories() {
        return this.categoryService.findAll();
    }

    @Query(() => [Category])
    fetchCategoriesWithDelete() {
        return this.categoryService.findAllWithDelete();
    }

    @Query(() => Category)
    fetchCategory(@Args('name') name: string) {
        return this.categoryService.findOne({ name });
    }

    @Mutation(() => Category)
    createCategory(@Args('name') name: string) {
        return this.categoryService.create({ name });
    }
}
