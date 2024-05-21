import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prismaService.$transaction(async (trnsClient) => {
      // create user account
      const account = await trnsClient.account.create({
        data: {
          username: createUserDto.username,
          password: createUserDto.password,
        },
      });

      this.logger.debug(`Account created: ${account.id}`);
      // create user with accountId
      const user = await trnsClient.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          accountId: account.id,
        },
      });

      this.logger.debug(`User created: ${user.id}`);

      return user;
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
