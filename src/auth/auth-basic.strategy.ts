import { BasicStrategy as Strategy } from 'passport-http';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { RolesEnum } from './roles';
import { UsersService } from '../users/users.service';
import { comparePasswords } from '../utils/security';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(BasicStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password): Promise<any> => {
    this.logger.debug('Validating user credentials...');
    try {
      if (
        this.configService.getOrThrow<string>('HTTP_BASIC_USER') === username &&
        this.configService.getOrThrow<string>('HTTP_BASIC_PASS') === password
      ) {
        return {
          role: RolesEnum.SUPER_ADMIN,
        };
      }

      const user = await this.usersService.findByUsername(username);
      if (!user) {
        this.logger.debug('User not found.');
        throw new UnauthorizedException();
      }
      if (await comparePasswords(password, user.password)) {
        return {
          role: user.type,
        };
      }

      this.logger.debug('Invalid password provided.');
      throw new UnauthorizedException();
    } catch (error) {
      throw new InternalServerErrorException(
        "An error occurred while validating the user's credentials.",
      );
    }
  };
}
