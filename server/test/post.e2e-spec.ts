import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth/register (POST)', () => {
    it('success', async () => {
      // given
      const requestBody: CreatePostDto = {
        content: 'contet',
      };

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      )
        .post('/posts')
        .send(requestBody);

      // then
      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(responseBody.content).toBe(requestBody.content);
    });
  });
});
