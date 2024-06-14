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
    // sets up Nest JS testing module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    // creates NestJS application instance
    app = moduleFixture.createNestApplication();
    // applys global validation pipe to the application
    app.useGlobalPipes(new ValidationPipe());
    // gets instance of UsersService from the test module
    usersService = moduleFixture.get<UsersService>(UsersService);
    // initilazes the NestJS application after all tests
    await app.init();
  });

  afterAll(async () => {
    //closes the Nest JS application after all tests
    await app.close();
  });

  afterEach(() => {
    // resets users array in UsersService after each test
    usersService['users'] = [];
  });

  it('should create a new user successfully and return 201', async () => {
    // for testing: valid user object
    const userData = {
      name: 'Jimmy Dean',
      email: 'jimmy.dean@gmail.com',
    };

    // POST request to create a new user
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(HttpStatus.CREATED);

    //verifies the response body for created user details
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toEqual(userData.name);
    expect(response.body.email).toEqual(userData.email);
  });

  it('should return 400 for invalid user data', async () => {
    // for testing: invalid user object with invalid name and email
    const invalidUserData = {
      name: '',
      email: 'invaild', 
    };

    //POST request with invaild user data
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(invalidUserData);
    
    //verifies response status code for bad request
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    //verifies response body for vaildation error detatils
    expect(response.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: ['email must be an email'],
      error: 'Bad Request',
    });
  });

  it('should return 409 for duplicate user data', async () => {
    //for testing: valid user object
    const userData = {
      name: 'Jimmy Dean',
      email: 'jimmy.dean@gmail.com',
    };

    //CREATE user with valid data
    await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(HttpStatus.CREATED) // expecting HTTP 201

    //trying to create the same user again
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userData);

    //verifies the response satus code for conflict
    expect(response.status).toBe(HttpStatus.CONFLICT);
    //verifies tthe response body for conflic error details
    expect(response.body).toEqual({
      statusCode: HttpStatus.CONFLICT,
      message: 'User already exists',
      error: 'Conflict',
    });
  });
});
