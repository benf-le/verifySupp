import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// Decorator để lấy thông tin user cho tuwfng request

export const GetUser = createParamDecorator(
    (key: string, context: ExecutionContext) => {
        const request:Express.Request = context.switchToHttp().getRequest();
        const user = request.user
        return key ? user?.[key] : user
    },
);