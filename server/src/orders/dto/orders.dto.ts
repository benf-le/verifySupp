import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsOptional,
    IsArray,
    ValidateNested,
    IsBoolean,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class OrderItemDTO {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsNumber()
    @IsNotEmpty()
    amount: number; // quantity
  
    @IsString()
    @IsNotEmpty()
    image: string;
  
    @IsNumber()
    @IsNotEmpty()
    price: number;
  
    @IsNumber()
    @IsOptional()
    discount?: number;
  
    @IsString()
    @IsNotEmpty()
    productId: string;
  }
  
  export class CreateOrderDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDTO)
    @IsNotEmpty()
    orderItems: OrderItemDTO[];
  
    @IsString()
    @IsNotEmpty()
    shippingAddress: string;
  
    @IsString()
    @IsNotEmpty()
    paymentMethod: string;
  
    @IsNumber()
    @IsNotEmpty()
    itemsPrice: number;
  
    @IsNumber()
    @IsNotEmpty()
    shippingPrice: number;
  
    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;
  }
  
  export class UpdateOrderDTO {
    @IsString()
    @IsOptional()
    shippingAddress?: string;
  
    @IsString()
    @IsOptional()
    paymentMethod?: string;
  
    @IsBoolean()
    @IsOptional()
    isPaid?: boolean;
  
    @IsBoolean()
    @IsOptional()
    isDelivered?: boolean;
  }