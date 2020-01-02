import * as express from 'express';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('Cats', () => {
    const server = express();

    beforeAll(async () => {
        const mod = await Test.createTestingModule({
            imports: [AppModule],
          })
          .compile();

        const app = mod.createNestApplication(server);
        await app.init();
    });

    it(`GET /`, () => {
        return request(server)
            .get('/')
            .expect(200)
            .expect({
              data: 'Hello world!'
            });
    });
});