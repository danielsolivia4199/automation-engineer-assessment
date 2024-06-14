import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';

describe('Get User (GET /users)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get<UsersService>(UsersService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    usersService['users'] = [];
  });

  it('should return all users with a 200 status code', async () => {
    const testUsers = [
      { id: 1, name: 'Jimmy Dean', email: 'jimmy.dean@gmail.com' },
      { id: 2, name: 'Tony Tiger', email: 'tonytiger@aol.com' },
    ];

    testUsers.forEach(user => usersService.create(user));

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK);
    
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(testUsers.length);
    expect(response.body).toEqual(expect.arrayContaining(testUsers));
  });

  it('should return an empty array if no users are found', async () => {
    usersService['users'] = [];

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(0);
      expect(response.body).toEqual([]);
  });
});
