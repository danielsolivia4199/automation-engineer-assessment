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
    //defines test users to be created
    const testUsers = [
      { id: 1, name: 'Jimmy Dean', email: 'jimmy.dean@gmail.com' },
      { id: 2, name: 'Tony Tiger', email: 'tonytiger@aol.com' },
    ];
    // creates a test for each user in the UsersService: manages interactions with user data, such as fetching users details
    testUsers.forEach(user => usersService.create(user));

    // sends get request to fetch all users
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK); // expects 200 status code
    
    // response body is to be an array
    expect(Array.isArray(response.body)).toBeTruthy();
    //response body is to have correct number of users
    expect(response.body.length).toBe(testUsers.length);
    // response vody to contail all test users
    expect(response.body).toEqual(expect.arrayContaining(testUsers));
  });

  it('should return an empty array if no users are found', async () => {
    //sets the users array in the UsersService to an empty array
    usersService['users'] = [];
    // GET request to fetch all users
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK); //expects 200 status code

      // respose body is to be an array
      expect(Array.isArray(response.body)).toBeTruthy();
      // response body is to be empty 
      expect(response.body.length).toBe(0);
      expect(response.body).toEqual([]);
  });
});
