import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginDto } from '../users/dto/user.dto';
import { User } from '../users/entities/user.entity';

export interface AuthTokens {
  access_token: string;
  user: {
    uuid: string;
    fullName: string;
    email: string;
    active: boolean;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida e-mail e senha via bcrypt.compare.
   * Chamado pela LocalStrategy antes de emitir o token.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.validateCredentials(email, password);
    return user as User | null;
  }

  /**
   * Gera o JWT após autenticação bem-sucedida.
   */
  buildTokenResponse(user: Pick<User, 'uuid' | 'email' | 'fullName' | 'active'>): AuthTokens {
    const payload = { sub: user.uuid, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        uuid: user.uuid,
        fullName: user.fullName,
        email: user.email,
        active: user.active,
      },
    };
  }

  /**
   * Registra novo usuário e retorna o token imediatamente.
   */
  async register(dto: CreateUserDto): Promise<AuthTokens> {
    const user = await this.usersService.create(dto);
    return this.buildTokenResponse(user);
  }

  /**
   * Login via credenciais (e-mail + senha).
   */
  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }
    return this.buildTokenResponse(user as User);
  }
}
