import { AuthGuard } from '@nestjs/passport';
import any = jasmine.any;
export class MyJwtGuard extends AuthGuard('jwt') {

}