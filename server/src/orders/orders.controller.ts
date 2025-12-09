import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { OrdersService } from './orders.service';
  import { CreateOrderDTO, UpdateOrderDTO } from './dto';
  import { Roles } from '../auth/decorator/roles.decorator';
  import { AuthorizationGuard } from '../auth/guard/authorization.guard';
  import { UserInfo, Users } from '../auth/decorator';
  import { UserType } from '@prisma/client';
  
  @Controller('orders')
  export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
  
    // Create order - USER only
    @Post('/create')
    @UseGuards(AuthorizationGuard)
    async createOrder(
      @Body() createOrderDTO: CreateOrderDTO,
      @Users() user: UserInfo,
    ) {
      return this.ordersService.createOrder(createOrderDTO, user.id);
    }
  
    // Get my orders - USER only
    @Get('/my-orders')
    @UseGuards(AuthorizationGuard)
    async getMyOrders(@Users() user: UserInfo) {
      return this.ordersService.getMyOrders(user.id);
    }
  
    // Get order by ID - USER (own orders) or ADMIN (all orders)
    @Get('/:id')
    @UseGuards(AuthorizationGuard)
    async getOrderById(
      @Param('id') orderId: string,
      @Users() user: UserInfo,
    ) {
      // Get user type from token (you may need to decode it or get from user object)
      // For now, assuming user object has userType, if not, you'll need to fetch it
      const userType = (user as any).userType || UserType.USER;
      return this.ordersService.getOrderById(orderId, user.id, userType);
    }
  
    // Get all orders - ADMIN only
    @Roles(UserType.ADMIN)
    @UseGuards(AuthorizationGuard)
    @Get()
    async getAllOrders() {
      return this.ordersService.getAllOrders();
    }
  
    // Update order - USER (own orders) or ADMIN (all orders)
    @Patch('/:id/update')
    @UseGuards(AuthorizationGuard)
    async updateOrder(
      @Param('id') orderId: string,
      @Body() updateOrderDTO: UpdateOrderDTO,
      @Users() user: UserInfo,
    ) {
      const userType = (user as any).userType || UserType.USER;
      return this.ordersService.updateOrder(
        orderId,
        updateOrderDTO,
        user.id,
        userType,
      );
    }
  
    // Mark order as paid - USER (own orders) or ADMIN (all orders)
    @Patch('/:id/pay')
    @UseGuards(AuthorizationGuard)
    async markOrderAsPaid(
      @Param('id') orderId: string,
      @Users() user: UserInfo,
    ) {
      const userType = (user as any).userType || UserType.USER;
      return this.ordersService.markOrderAsPaid(orderId, user.id, userType);
    }
  
    // Mark order as delivered - ADMIN only
    @Roles(UserType.ADMIN)
    @UseGuards(AuthorizationGuard)
    @Patch('/:id/deliver')
    async markOrderAsDelivered(@Param('id') orderId: string) {
      return this.ordersService.markOrderAsDelivered(orderId);
    }
  
    // Delete order - USER (own orders) or ADMIN (all orders)
    @Delete('/:id')
    @UseGuards(AuthorizationGuard)
    async deleteOrder(
      @Param('id') orderId: string,
      @Users() user: UserInfo,
    ) {
      const userType = (user as any).userType || UserType.USER;
      return this.ordersService.deleteOrder(orderId, user.id, userType);
    }
  }