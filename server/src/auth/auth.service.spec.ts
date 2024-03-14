import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { MockUserService } from 'src/user/user.service.spec';
import { HashingService } from 'src/util/hashing/hashing.service';
import { MockHashingService } from 'src/util/hashing/hashing.service.spec';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: HashingService, useClass: MockHashingService },
        { provide: UserService, useClass: MockUserService },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('success', async () => {
      // given
      const dto: RegisterDto = {
        username: 'username',
        password: 'password',
      };

      // when
      await service.register(dto);
    });
  });
});
