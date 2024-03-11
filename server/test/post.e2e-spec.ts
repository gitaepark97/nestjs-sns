import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { Post } from 'src/post/domain/post';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { ModifyPostDto } from 'src/post/dto/modify-post.dto';
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

  describe('/posts/:postId (GET)', () => {
    it('success', async () => {
      // given
      const { body: post } = await request(app.getHttpServer())
        .post('/posts')
        .send({ content: 'content' });

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      ).get(`/posts/${post.id}`);

      // then
      expect(statusCode).toBe(HttpStatus.OK);
      expect(responseBody.id).toBe(post.id);
      expect(responseBody.content).toBe(post.content);
    });

    it('not found post', async () => {
      // given

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      ).get('/posts/0');

      // then
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(responseBody.message).toBe('해당 ID의 Post가 없습니다.');
    });
  });

  describe('/posts/:postId (PATCH)', () => {
    it('success modify nothing', async () => {
      // given
      const { body: post } = await request(app.getHttpServer())
        .post('/posts')
        .send({ content: 'content' });
      const requestBody: ModifyPostDto = {};

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      )
        .patch(`/posts/${post.id}`)
        .send(requestBody);

      // then
      expect(statusCode).toBe(HttpStatus.OK);
      expect(responseBody.id).toBe(post.id);
      expect(responseBody.content).toBe(post.content);
    });

    it('success modify content', async () => {
      // given
      const { body: post } = await request(app.getHttpServer())
        .post('/posts')
        .send({ content: 'content' });
      const requestBody: ModifyPostDto = {
        content: 'modified content',
      };

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      )
        .patch(`/posts/${post.id}`)
        .send(requestBody);

      // then
      expect(statusCode).toBe(HttpStatus.OK);
      expect(responseBody.id).toBe(post.id);
      expect(responseBody.content).toBe(requestBody.content);
    });

    it('not found post', async () => {
      // given
      const requestBody: ModifyPostDto = {};

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      )
        .patch('/posts/0')
        .send(requestBody);

      // then
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(responseBody.message).toBe('해당 ID의 Post가 없습니다.');
    });
  });
});
