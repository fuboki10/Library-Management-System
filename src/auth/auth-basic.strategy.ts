import { BasicStrategy as Strategy } from 'passport-http';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(BasicStrategy.name);
  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password): Promise<boolean> => {
    this.logger.debug('Validating user credentials...');
    try {
      if (
        this.configService.getOrThrow<string>('HTTP_BASIC_USER') === username &&
        this.configService.getOrThrow<string>('HTTP_BASIC_PASS') === password
      ) {
        return true;
      }
      this.logger.debug('Invalid credentials provided.');
      throw new UnauthorizedException();
    } catch (error) {
      throw new InternalServerErrorException(
        "An error occurred while validating the user's credentials.",
      );
    }
  };
}
