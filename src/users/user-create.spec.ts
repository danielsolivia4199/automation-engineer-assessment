import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';
import exp from 'constants';

describe('User Creation (POST /users)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    usersService = moduleFixture.get<UsersService>(UsersService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    usersService['users'] = [];
  });

  it('should create a new user successfully and return 201', async () => {
    const userData = {
      name: 'Jimmy Dean',
      email: 'jimmy.dean@gmail.com',
    };

    // POST request to create a new user
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(HttpStatus.CREATED);

    //verify the response
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toEqual(userData.name);
    expect(response.body.email).toEqual(userData.email);
  });

  it('should return 400 for invalid user data', async () => {
    const invalidUserData = {
      name: '',
      email: 'invaild', 
    };

    //POST request with invaild user data
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(invalidUserData);
    
    //verify response status code
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    //verify response body for vaildation error detatils
    expect(response.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: ['email must be an email'],
      error: 'Bad Request',
    });
  });

  it('should return 409 for duplicate user data', async () => {
    const userData = {
      name: 'Jimmy Dean',
      email: 'jimmy.dean@gmail.com',
    };

    //CREATE first user
    await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(HttpStatus.CREATED)

    //try to create the same user again
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userData);

    //verify the resposse
    expect(response.status).toBe(HttpStatus.CONFLICT);
    expect(response.body).toEqual({
      statusCode: HttpStatus.CONFLICT,
      message: 'User already exists',
      error: 'Conflict',
    });
  });
});
