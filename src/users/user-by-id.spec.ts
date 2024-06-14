import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';
import { after } from 'node:test';

describe('User Retrieval by id (GET /users/{id}', () => {
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

  it('should return the correct user details with a 200 status code',
    async () => {
      // Test data: single sample user
      const testUser = { id: 1, name: 'Jimmy Dean', email: 'jimmy.dean@gmail.com' };
      
      // Create the sample user using the UsersService
      usersService.create(testUser);
      // sends GET request to retrieve the user by ID
      const response = await request(app.getHttpServer())
        .get(`/users/${testUser.id}`)
        .expect(HttpStatus.OK); // Expecting HTTP status code 200
      // verifies that response body matches the expected user details
      expect(response.body).toEqual(testUser);
    });

    it('should return a 404 status code if the user is not found', async () => {
      // FOR TESTING: user with ID 100 does not exist
      const nonExistentUserId = 100;

      // GET request for non-existant user ID
      const response = await request(app.getHttpServer())
        .get(`/users/${nonExistentUserId}`)
        .expect(HttpStatus.NOT_FOUND); // Expecting HTTP status code 404
      
      // verifies that the response body includes the correct error message
      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
        error: 'Not Found',
      });
  });
});
