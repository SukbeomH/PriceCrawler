import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CreateCartInput } from './dto/createCart.input';
import { Cart } from './entities/cart.entity';

@Resolver()
export class CartResolver {
    constructor(private readonly cartService: CartService) {}

    @Query(() => [Cart])
    fetchProducts() {
        return this.cartService.findAll();
    }

    @Query(() => Cart)
    fetchProduct(@Args('cartId') cartId: string) {
        return this.cartService.findOne({ cartId });
    }

    @Mutation(() => Cart)
    createCart(@Args('createCartInput') createCartInput: CreateCartInput) {
        return this.cartService.create({ createCartInput });
    }
}
