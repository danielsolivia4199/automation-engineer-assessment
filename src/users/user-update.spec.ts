import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';

describe('User Update (PATCH /users/{id})', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    usersService = moduleFixture.get<UsersService>(UsersService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });


 // for testing: successful update of user details will return 204 status code
  it('should update users details and return 204 status code',
    async () => {
      const initialUserData = {
        name: 'Jimmy Dean',
        email: 'jimmy.dean@gmail.com',
      };
      // creates user with initial data
      const createdUser = await usersService.create(initialUserData);

      const updatedUserData = {
        name: 'James Dean',
        email: 'james.dean@gmail.com',
      };
      // sends a patch request to update user's details
      const response = await request(app.getHttpServer())
        .patch(`/users/${createdUser.id}`)
        .send(updatedUserData)
        .expect(HttpStatus.NO_CONTENT);

      // verifies response
      expect(response.body).toEqual({});

      const updatedUser = await usersService.findOne(createdUser.id);
      expect(updatedUser).toBeDefined();
      expect(updatedUser.name).toEqual(updatedUserData.name);
      expect(updatedUser.email).toEqual(updatedUserData.email);
    });
    // for testing: attempt to update non existant user
    it('should return a 404 status code for updating non-existing user', async () => {
      const nonExistentUserId = 100;

      const updatedUserData = {
        name: 'James Dean',
        email: 'james.dean@gmail.com',
      };
      // seds a patch request to update a user with non existant user ID
      const response = await request(app.getHttpServer())
        .patch(`/users/${nonExistentUserId}`)
        .send(updatedUserData)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
        error: 'Not Found',
    });
    });
    // for testing: invalid input data when updating a user
    it('should return 400 status code for invalid input data', async () => {
      const initialUserData = {
        name: 'Jimmy Dean',
        email: 'jimmy-dean@gmail.com',
      };
      // creats user with valid data
      const createdUser = await usersService.create(initialUserData);

      const invalidUserData = {
        email: 'invalid-email',
      };
      //sending patch request with invaild data
      const response = await request(app.getHttpServer())
        .patch(`/users/${createdUser.id}`)
        .send(invalidUserData)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['email must be an email'],
        error: 'Bad Request',
    });
  });
});
