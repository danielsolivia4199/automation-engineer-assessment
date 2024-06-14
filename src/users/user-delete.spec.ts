import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';

describe('User Deletion (DELETE /users/{id}', () => {
  let app;
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

  it('should delete a user, returns a 204 status code', async () => {
    //creates user to be deleted
    const createUserDto = { //User DTO: Data Transfer Object, used to define the structure of data being transferred between different layers of an application
      name: 'Jimmy Dean',
      email: 'jimmy.dean@gmail.com',
    };
    const createdUser = await usersService.create(createUserDto);

    // sends a DELETE request to delete user
    await usersService.remove(createdUser.id);

    //tries to find the deleted user, expects NotFoundException: used to handle cases where an expected resource cannot be located
    try {
      await usersService.findOne(createdUser.id);
      fail('Expected NotFoundException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('User not found');
    }
  });

  it('should throw NotFoundException when deleting a non-existing user, returns a 404 status code', async () => {
    const nonExistingUserId = 100;
    //tries to delete user that does not exist
    try {
      await usersService.remove(nonExistingUserId);
      fail('Expected NotFoundException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('User not found');
    }
  });
});
