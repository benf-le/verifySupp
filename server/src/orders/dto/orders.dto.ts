import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsOptional,
    IsArray,
    ValidateNested,
    IsBoolean,
  } from 'class-validator';
  import { Type, Transform } from 'class-transformer';
  
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
    @Transform(({ value }) => parseFloat(value))
    price: number; // Decimal - giá USD
  
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value ? parseFloat(value) : undefined)
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
    @Transform(({ value }) => parseInt(value, 10))
    itemsPrice: number;
  
    @IsNumber()
    @IsNotEmpty()
    shippingPrice: number;
  
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
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