import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { AllExceptionsFilter } from 'src/common/exception/all-exception.filter';
import { Post } from 'src/post/domain/post';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { ModifyPostDto } from 'src/post/dto/modify-post.dto';
import request from 'supertest';

describe('PostController (e2e)', () => {
  let app: INestApplication;
  const userId = 1;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(app.get(AllExceptionsFilter));
    await app.init();

    const requestBody: RegisterDto = {
      username: 'username',
      password: 'password',
    };

    // when
    await request(app.getHttpServer()).post(`/auth/register`).send(requestBody);
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
        .post(`/posts?userId=${userId}`)
        .send(requestBody);

      // then
      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(responseBody.id).toEqual(expect.any(Number));
      expect(responseBody.user.id).toEqual(userId);
      expect(responseBody.user.username).toEqual(expect.any(String));
      expect(responseBody.user.hashedPassword).toEqual(expect.any(String));
      expect(responseBody.content).toBe(requestBody.content);
    });

    it('concurrency success', async () => {
      // given
      const requestBody: CreatePostDto = {
        content: 'contet',
      };
      const count = 10;

      // when
      const responses = await Promise.allSettled(
        Array.from({ length: count }, () =>
          request(app.getHttpServer())
            .post(`/posts?userId=${userId}`)
            .send(requestBody),
        ),
      );

      // then
      expect(responses.length).toBe(count);
      responses.forEach((response: any) => {
        switch (response.value.statusCode) {
          case HttpStatus.CREATED:
            expect(response.value._body.id).toEqual(expect.any(Number));
            expect(response.value._body.user.id).toEqual(userId);
            expect(response.value._body.user.username).toEqual(
              expect.any(String),
            );
            expect(response.value._body.user.hashedPassword).toEqual(
              expect.any(String),
            );
            expect(response.value._body.content).toBe(requestBody.content);
            break;
          case HttpStatus.INTERNAL_SERVER_ERROR:
            expect(response.value._body.message).toBe('Internal server error');
            break;
          default:
            throw Error();
        }
      });
    });
  });

  describe('/posts (GET)', () => {
    it('success', async () => {
      // given
      const requestBodys: CreatePostDto[] = [];
      const count = 10;
      for (let i = 1; i <= count; i++) {
        requestBodys.push({ content: `content${i}` });
      }
      for await (const requestBody of requestBodys) {
        await request(app.getHttpServer())
          .post(`/posts?userId=${userId}`)
          .send(requestBody);
      }

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      ).get('/posts');

      // then
      expect(statusCode).toBe(HttpStatus.OK);
      expect(responseBody.posts.length).toBe(count);
      responseBody.posts.forEach((post: Post) => {
        expect(post.id).toEqual(expect.any(Number));
        expect(post.user.id).toEqual(userId);
        expect(post.user.username).toEqual(expect.any(String));
        expect(post.user.hashedPassword).toEqual(expect.any(String));
        expect(post.content).toEqual(expect.any(String));
      });
    });
  });

  describe('/posts/:postId (GET)', () => {
    it('success', async () => {
      // given
      const { body: post } = await request(app.getHttpServer())
        .post(`/posts?userId=${userId}`)
        .send({ content: 'content' });

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      ).get(`/posts/${post.id}`);

      // then
      expect(statusCode).toBe(HttpStatus.OK);
      expect(responseBody.id).toBe(post.id);
      expect(responseBody.user.id).toEqual(userId);
      expect(responseBody.user.username).toEqual(expect.any(String));
      expect(responseBody.user.hashedPassword).toEqual(expect.any(String));
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
        .post(`/posts?userId=${userId}`)
        .send({ content: 'content' });
      const requestBody: ModifyPostDto = {};

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      )
        .patch(`/posts/${post.id}?userId=${userId}`)
        .send(requestBody);

      // then
      expect(statusCode).toBe(HttpStatus.OK);
      expect(responseBody.id).toBe(post.id);
      expect(responseBody.user.id).toEqual(userId);
      expect(responseBody.user.username).toEqual(expect.any(String));
      expect(responseBody.user.hashedPassword).toEqual(expect.any(String));
      expect(responseBody.content).toBe(post.content);
    });

    it('success modify content', async () => {
      // given
      const { body: post } = await request(app.getHttpServer())
        .post(`/posts?userId=${userId}`)
        .send({ content: 'content' });
      const requestBody: ModifyPostDto = {
        content: 'modified content',
      };

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      )
        .patch(`/posts/${post.id}?userId=${userId}`)
        .send(requestBody);

      // then
      expect(statusCode).toBe(HttpStatus.OK);
      expect(responseBody.id).toBe(post.id);
      expect(responseBody.user.id).toEqual(userId);
      expect(responseBody.user.username).toEqual(expect.any(String));
      expect(responseBody.user.hashedPassword).toEqual(expect.any(String));
      expect(responseBody.content).toBe(requestBody.content);
    });

    it('not found post', async () => {
      // given
      const requestBody: ModifyPostDto = {};

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      )
        .patch('/posts/0?userId=0')
        .send(requestBody);

      // then
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(responseBody.message).toBe('해당 ID의 Post가 없습니다.');
    });

    it('forbidden', async () => {
      // given
      const { body: post } = await request(app.getHttpServer())
        .post(`/posts?userId=${userId}`)
        .send({ content: 'content' });
      const requestBody: ModifyPostDto = {
        content: 'modified content',
      };

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      )
        .patch(`/posts/${post.id}?userId=0`)
        .send(requestBody);

      // then
      expect(statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(responseBody.message).toBe('작성자만 수정 가능합니다.');
    });
  });

  describe('/posts/:postId (DELETE)', () => {
    it('success', async () => {
      // given
      const { body: post } = await request(app.getHttpServer())
        .post(`/posts?userId=${userId}`)
        .send({ content: 'content' });

      // when
      const { statusCode } = await request(app.getHttpServer()).delete(
        `/posts/${post.id}?userId=${userId}`,
      );

      // then
      expect(statusCode).toBe(HttpStatus.OK);
    });

    it('not found post', async () => {
      // given

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      ).delete('/posts/0?userId=0');

      // then
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(responseBody.message).toBe('해당 ID의 Post가 없습니다.');
    });

    it('forbidden', async () => {
      // given
      const { body: post } = await request(app.getHttpServer())
        .post(`/posts?userId=${userId}`)
        .send({ content: 'content' });

      // when
      const { statusCode, body: responseBody } = await request(
        app.getHttpServer(),
      ).delete(`/posts/${post.id}?userId=0`);

      // then
      expect(statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(responseBody.message).toBe('작성자만 삭제 가능합니다.');
    });
  });
});
