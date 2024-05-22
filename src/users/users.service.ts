import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../utils/security';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new user.
   * @param createUserDto - The data for creating a new user.
   * @returns The created user.
   */
  create(createUserDto: CreateUserDto) {
    return this.prismaService.$transaction(async (trnsClient) => {
      // create user account
      const account = await trnsClient.account.create({
        data: {
          username: createUserDto.username,
          password: await hashPassword(createUserDto.password),
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

  /**
   * Retrieves all users.
   * @returns An array of users.
   */
  findAll() {
    return this.prismaService.user.findMany({
      where: {},
    });
  }

  /**
   * Retrieves a user by ID.
   * @param id - The ID of the user.
   * @returns The user with the specified ID.
   */
  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Updates a user.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The data for updating the user.
   * @returns The updated User
   */
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  /**
   * Removes a user.
   * @param id - The ID of the user to remove.
   * @returns The deleted User.
   */
  remove(id: number) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
