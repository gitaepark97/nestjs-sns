import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { AllExceptionsFilter } from 'src/common/exception/all-exception.filter';
import request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(app.get(AllExceptionsFilter));
    await app.init();
  });

  describe('/auth/regsiter (POST)', () => {
    it('success', async () => {
      // given
      const requestBody: RegisterDto = {
        username: 'username',
        password: 'password',
      };

      // when
      const { statusCode } = await request(app.getHttpServer())
        .post(`/auth/register`)
        .send(requestBody);

      // then
      expect(statusCode).toBe(HttpStatus.CREATED);
    });

    it('username conflict', async () => {
      // given
      const requestBody: RegisterDto = {
        username: 'username',
        password: 'password',
      };
      await request(app.getHttpServer())
        .post(`/auth/register`)
        .send(requestBody);

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      )
        .post(`/auth/register`)
        .send(requestBody);

      // then
      expect(statusCode).toBe(HttpStatus.CONFLICT);
      expect(responseBody.message).toBe('이미 사용 중인 username입니다.');
    });
  });
});
