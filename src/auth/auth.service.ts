import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async signup(createUserDto: CreateUserDto) {
     this.userService.create(createUserDto);
    }
}
