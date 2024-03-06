import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { Post } from 'src/post/domain/post';
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

  describe('/posts (POST)', () => {
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
      expect(responseBody.id).toEqual(expect.any(Number));
      expect(responseBody.content).toBe(requestBody.content);
    });
  });

  describe('/posts (GET)', () => {
    it('success', async () => {
      // given
      const count = 10;
      const requestBodys: CreatePostDto[] = [];
      for (let i = 1; i <= count; i++) {
        requestBodys.push({ content: `content${i}` });
      }
      await Promise.all(
        requestBodys.map((requestBody) =>
          request(app.getHttpServer()).post('/posts').send(requestBody),
        ),
      );

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      ).get('/posts');

      // then
      expect(statusCode).toBe(HttpStatus.OK);
      expect(responseBody.posts.length).toBe(count);
      responseBody.posts.forEach((post: Post) => {
        expect(post.id).toEqual(expect.any(Number));
        expect(post.content).toEqual(expect.any(String));
      });
    });
  });
});
