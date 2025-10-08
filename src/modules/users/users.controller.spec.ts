import { ConflictException, NotFoundException } from '@nestjs/common';

/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto, UsersListResponseDto } from './dto/response.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUserResponse: UserResponseDto = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    isActive: true,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a user successfully', async () => {
      // Arrange
      usersService.create.mockResolvedValue(mockUserResponse);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      usersService.create.mockRejectedValue(
        new ConflictException('User with this email already exists'),
      );

      // Act & Assert
      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle validation errors from service', async () => {
      // Arrange
      const invalidDto = { ...createUserDto, email: 'invalid-email' };
      usersService.create.mockRejectedValue(new Error('Validation failed'));

      // Act & Assert
      await expect(controller.create(invalidDto)).rejects.toThrow(
        'Validation failed',
      );
    });
  });

  describe('findAll', () => {
    it('should return all active users', async () => {
      // Arrange
      const mockUsers = [
        mockUserResponse,
        { ...mockUserResponse, id: 2, email: 'user2@example.com' },
      ];
      const expectedResponse: UsersListResponseDto = { data: mockUsers };
      usersService.findAll.mockResolvedValue(mockUsers);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });

    it('should return empty array when no users exist', async () => {
      // Arrange
      usersService.findAll.mockResolvedValue([]);
      const expectedResponse: UsersListResponseDto = { data: [] };

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(expectedResponse);
    });

    it('should handle service errors', async () => {
      // Arrange
      usersService.findAll.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(controller.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      // Arrange
      usersService.findOne.mockResolvedValue(mockUserResponse);

      // Act
      const result = await controller.findOne(1);

      // Assert
      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      usersService.findOne.mockRejectedValue(
        new NotFoundException('User with ID 999 not found'),
      );

      // Act & Assert
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(usersService.findOne).toHaveBeenCalledWith(999);
    });

    it('should handle invalid id parameter', async () => {
      // Arrange
      const invalidId = NaN;
      usersService.findOne.mockRejectedValue(new Error('Invalid ID'));

      // Act & Assert
      await expect(controller.findOne(invalidId)).rejects.toThrow('Invalid ID');
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated User',
      email: 'updated@example.com',
    };

    it('should update a user successfully', async () => {
      // Arrange
      const updatedUser = { ...mockUserResponse, ...updateUserDto };
      usersService.update.mockResolvedValue(updatedUser);

      // Act
      const result = await controller.update(1, updateUserDto);

      // Assert
      expect(usersService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should update user with partial data', async () => {
      // Arrange
      const partialUpdate: UpdateUserDto = { name: 'New Name Only' };
      const updatedUser = { ...mockUserResponse, name: 'New Name Only' };
      usersService.update.mockResolvedValue(updatedUser);

      // Act
      const result = await controller.update(1, partialUpdate);

      // Assert
      expect(usersService.update).toHaveBeenCalledWith(1, partialUpdate);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      usersService.update.mockRejectedValue(
        new NotFoundException('User with ID 999 not found'),
      );

      // Act & Assert
      await expect(controller.update(999, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(usersService.update).toHaveBeenCalledWith(999, updateUserDto);
    });

    it('should throw ConflictException when email is already in use', async () => {
      // Arrange
      usersService.update.mockRejectedValue(
        new ConflictException('Email is already in use'),
      );

      // Act & Assert
      await expect(
        controller.update(1, { email: 'existing@example.com' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should handle empty update data', async () => {
      // Arrange
      const emptyUpdate: UpdateUserDto = {};
      usersService.update.mockResolvedValue(mockUserResponse);

      // Act
      const result = await controller.update(1, emptyUpdate);

      // Assert
      expect(usersService.update).toHaveBeenCalledWith(1, emptyUpdate);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('remove', () => {
    it('should soft delete a user successfully', async () => {
      // Arrange
      usersService.remove.mockResolvedValue(undefined);

      // Act
      const result = await controller.remove(1);

      // Assert
      expect(usersService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      usersService.remove.mockRejectedValue(
        new NotFoundException('User with ID 999 not found'),
      );

      // Act & Assert
      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(usersService.remove).toHaveBeenCalledWith(999);
    });

    it('should throw NotFoundException when user is already inactive', async () => {
      // Arrange
      usersService.remove.mockRejectedValue(
        new NotFoundException('User with ID 1 not found'),
      );

      // Act & Assert
      await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should handle service errors during deletion', async () => {
      // Arrange
      usersService.remove.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(controller.remove(1)).rejects.toThrow('Database error');
    });
  });

  describe('integration scenarios', () => {
    it('should handle concurrent user creation attempts', async () => {
      // Arrange
      const createUserDto1: CreateUserDto = {
        name: 'User 1',
        email: 'same@example.com',
        password: 'password123',
      };
      const createUserDto2: CreateUserDto = {
        name: 'User 2',
        email: 'same@example.com',
        password: 'password456',
      };

      usersService.create
        .mockResolvedValueOnce(mockUserResponse)
        .mockRejectedValueOnce(
          new ConflictException('User with this email already exists'),
        );

      // Act
      const result1 = await controller.create(createUserDto1);

      // Assert
      expect(result1).toEqual(mockUserResponse);
      await expect(controller.create(createUserDto2)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle user lifecycle (create -> read -> update -> delete)', async () => {
      // Arrange
      const createDto: CreateUserDto = {
        name: 'Lifecycle User',
        email: 'lifecycle@example.com',
        password: 'password123',
      };
      const updateDto: UpdateUserDto = { name: 'Updated Lifecycle User' };

      usersService.create.mockResolvedValue(mockUserResponse);
      usersService.findOne.mockResolvedValue(mockUserResponse);
      usersService.update.mockResolvedValue({
        ...mockUserResponse,
        name: 'Updated Lifecycle User',
      });
      usersService.remove.mockResolvedValue(undefined);

      // Act & Assert
      // Create
      const created = await controller.create(createDto);
      expect(created).toEqual(mockUserResponse);

      // Read
      const found = await controller.findOne(1);
      expect(found).toEqual(mockUserResponse);

      // Update
      const updated = await controller.update(1, updateDto);
      expect(updated.name).toBe('Updated Lifecycle User');

      // Delete
      await expect(controller.remove(1)).resolves.toBeUndefined();
    });
  });
});
