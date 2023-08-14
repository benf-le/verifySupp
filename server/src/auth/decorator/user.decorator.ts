// Decorator để lấy thông tin user cho tuwfng request

import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export interface UserInfo {
    email: string;
    id: string;
    createdAt: number
    updatedAt: number
}
export const Users = createParamDecorator((data, context: ExecutionContext)=>{
    const request = context.switchToHttp().getRequest()
    return request.user
})


// export const Userss = createParamDecorator(
//     (key: string, context: ExecutionContext) => {
//         const request:Express.Request = context.switchToHttp().getRequest();
//         const user = request.user
//         return key ? user?.[key] : user
//     },
//
// );
