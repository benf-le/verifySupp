import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { CreateOrderDTO, UpdateOrderDTO, OrderItemDTO } from './dto';
  import { UserInfo } from '../auth/decorator';
  import { UserType } from '@prisma/client';
  
  @Injectable()
  export class OrdersService {
    constructor(private readonly prismaService: PrismaService) {}
  
    async createOrder(createOrderDTO: CreateOrderDTO, userId: string) {
      try {
        // Validate products exist and check stock
        for (const item of createOrderDTO.orderItems) {
          const product = await this.prismaService.products.findUnique({
            where: { id: item.productId },
          });
  
          if (!product) {
            throw new NotFoundException(
              `Product with ID ${item.productId} not found`,
            );
          }
  
          if (product.countInStock < item.amount) {
            throw new BadRequestException(
              `Insufficient stock for product ${product.name}. Available: ${product.countInStock}, Requested: ${item.amount}`,
            );
          }
        }
  
        // Create order with order items
        const order = await this.prismaService.order.create({
          data: {
            shippingAddress: createOrderDTO.shippingAddress,
            paymentMethod: createOrderDTO.paymentMethod,
            itemsPrice: createOrderDTO.itemsPrice,
            shippingPrice: createOrderDTO.shippingPrice,
            totalPrice: createOrderDTO.totalPrice,
            user: {
              connect: { id: userId },
            },
            orderItems: {
              create: createOrderDTO.orderItems.map((item) => ({
                name: item.name,
                amount: item.amount,
                image: item.image,
                price: item.price,
                discount: item.discount,
                product: {
                  connect: { id: item.productId },
                },
              })),
            },
          },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });
  
        // Update product stock
        for (const item of createOrderDTO.orderItems) {
          await this.prismaService.products.update({
            where: { id: item.productId },
            data: {
              countInStock: {
                decrement: item.amount,
              },
            },
          });
        }
  
        return order;
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
        throw new Error(`Could not create order: ${error.message}`);
      }
    }
  
    async getMyOrders(userId: string) {
      try {
        const orders = await this.prismaService.order.findMany({
          where: {
            userId,
          },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
  
        return orders;
      } catch (error) {
        throw new Error(`Could not get orders: ${error.message}`);
      }
    }
  
    async getOrderById(orderId: string, userId: string, userType: UserType) {
      try {
        const order = await this.prismaService.order.findUnique({
          where: { id: orderId },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });
  
        if (!order) {
          throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
  
        // Check if user has permission to view this order
        if (userType !== UserType.ADMIN && order.userId !== userId) {
          throw new ForbiddenException(
            'You do not have permission to view this order',
          );
        }
  
        return order;
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof ForbiddenException
        ) {
          throw error;
        }
        throw new Error(`Could not get order: ${error.message}`);
      }
    }
  
    async getAllOrders() {
      try {
        const orders = await this.prismaService.order.findMany({
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
  
        return orders;
      } catch (error) {
        throw new Error(`Could not get orders: ${error.message}`);
      }
    }
  
    async updateOrder(
      orderId: string,
      updateOrderDTO: UpdateOrderDTO,
      userId: string,
      userType: UserType,
    ) {
      try {
        const order = await this.prismaService.order.findUnique({
          where: { id: orderId },
        });
  
        if (!order) {
          throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
  
        // Check if user has permission to update this order
        if (userType !== UserType.ADMIN && order.userId !== userId) {
          throw new ForbiddenException(
            'You do not have permission to update this order',
          );
        }
  
        const updateData: any = {};
  
        if (updateOrderDTO.shippingAddress !== undefined) {
          updateData.shippingAddress = updateOrderDTO.shippingAddress;
        }
  
        if (updateOrderDTO.paymentMethod !== undefined) {
          updateData.paymentMethod = updateOrderDTO.paymentMethod;
        }
  
        if (updateOrderDTO.isPaid !== undefined) {
          updateData.isPaid = updateOrderDTO.isPaid;
          if (updateOrderDTO.isPaid) {
            updateData.paidAt = new Date();
          } else {
            updateData.paidAt = null;
          }
        }
  
        if (updateOrderDTO.isDelivered !== undefined) {
          // Only admin can update delivery status
          if (userType !== UserType.ADMIN) {
            throw new ForbiddenException(
              'Only admin can update delivery status',
            );
          }
          updateData.isDelivered = updateOrderDTO.isDelivered;
          if (updateOrderDTO.isDelivered) {
            updateData.deliveredAt = new Date();
          } else {
            updateData.deliveredAt = null;
          }
        }
  
        const updatedOrder = await this.prismaService.order.update({
          where: { id: orderId },
          data: updateData,
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });
  
        return updatedOrder;
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof ForbiddenException
        ) {
          throw error;
        }
        throw new Error(`Could not update order: ${error.message}`);
      }
    }
  
    async deleteOrder(orderId: string, userId: string, userType: UserType) {
      try {
        const order = await this.prismaService.order.findUnique({
          where: { id: orderId },
          include: {
            orderItems: true,
          },
        });
  
        if (!order) {
          throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
  
        // Check if user has permission to delete this order
        if (userType !== UserType.ADMIN && order.userId !== userId) {
          throw new ForbiddenException(
            'You do not have permission to delete this order',
          );
        }
  
        // Restore product stock if order is deleted
        for (const item of order.orderItems) {
          await this.prismaService.products.update({
            where: { id: item.productId },
            data: {
              countInStock: {
                increment: item.amount,
              },
            },
          });
        }
  
        await this.prismaService.order.delete({
          where: { id: orderId },
        });
  
        return { message: 'Order deleted successfully' };
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof ForbiddenException
        ) {
          throw error;
        }
        throw new Error(`Could not delete order: ${error.message}`);
      }
    }
  
    async markOrderAsPaid(orderId: string, userId: string, userType: UserType) {
      try {
        const order = await this.prismaService.order.findUnique({
          where: { id: orderId },
        });
  
        if (!order) {
          throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
  
        // Check if user has permission
        if (userType !== UserType.ADMIN && order.userId !== userId) {
          throw new ForbiddenException(
            'You do not have permission to update this order',
          );
        }
  
        const updatedOrder = await this.prismaService.order.update({
          where: { id: orderId },
          data: {
            isPaid: true,
            paidAt: new Date(),
          },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });
  
        return updatedOrder;
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof ForbiddenException
        ) {
          throw error;
        }
        throw new Error(`Could not mark order as paid: ${error.message}`);
      }
    }
  
    async markOrderAsDelivered(orderId: string) {
      try {
        const order = await this.prismaService.order.findUnique({
          where: { id: orderId },
        });
  
        if (!order) {
          throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
  
        const updatedOrder = await this.prismaService.order.update({
          where: { id: orderId },
          data: {
            isDelivered: true,
            deliveredAt: new Date(),
          },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });
  
        return updatedOrder;
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof ForbiddenException
        ) {
          throw error;
        }
        throw new Error(`Could not mark order as delivered: ${error.message}`);
      }
    }
  }