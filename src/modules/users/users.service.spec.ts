import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

// Mock bcrypt
jest.mock('bcryptjs');
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

// Create a comprehensive mock for PrismaService
const createMockPrismaService = () => ({
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
});

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: ReturnType<typeof createMockPrismaService>;

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: 'user',
    isActive: true,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  const mockUserResponse = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    isActive: true,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    prismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);
      bcryptMock.hash.mockResolvedValue('hashedPassword123' as never);
      prismaService.user.create.mockResolvedValue(mockUserResponse);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcryptMock.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: 'hashedPassword123',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcryptMock.hash).not.toHaveBeenCalled();
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all active users', async () => {
      // Arrange
      const mockUsers = [mockUserResponse, { ...mockUserResponse, id: 2 }];
      prismaService.user.findMany.mockResolvedValue(mockUsers);

      // Act
      const result = await service.findAll();

      // Assert
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no active users exist', async () => {
      // Arrange
      prismaService.user.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      // Arrange
      prismaService.user.findFirst.mockResolvedValue(mockUserResponse);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      prismaService.user.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'User with ID 999 not found',
      );
    });

    it('should throw NotFoundException when user is inactive', async () => {
      // Arrange
      prismaService.user.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
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
      prismaService.user.findFirst.mockResolvedValueOnce(mockUserResponse); // for findOne check
      prismaService.user.findFirst.mockResolvedValueOnce(null); // for email uniqueness check
      prismaService.user.update.mockResolvedValue(updatedUser);

      // Act
      const result = await service.update(1, updateUserDto);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should update user with password hashing', async () => {
      // Arrange
      const updateWithPassword: UpdateUserDto = {
        password: 'newPassword123',
      };
      prismaService.user.findFirst.mockResolvedValue(mockUserResponse);
      bcryptMock.hash.mockResolvedValue('newHashedPassword' as never);
      prismaService.user.update.mockResolvedValue(mockUserResponse);

      // Act
      await service.update(1, updateWithPassword);

      // Assert
      expect(bcryptMock.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          password: 'newHashedPassword',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      prismaService.user.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when email is already in use', async () => {
      // Arrange
      const anotherUser = { ...mockUser, id: 2 };
      prismaService.user.findFirst
        .mockResolvedValueOnce(mockUserResponse) // for findOne check (user exists)
        .mockResolvedValueOnce(anotherUser); // for email uniqueness check (email exists)

      // Act & Assert
      await expect(
        service.update(1, { email: 'existing@example.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should soft delete a user successfully', async () => {
      // Arrange
      prismaService.user.findFirst.mockResolvedValue(mockUserResponse);
      prismaService.user.update.mockResolvedValue({
        ...mockUserResponse,
        isActive: false,
      });

      // Act
      await service.remove(1);

      // Assert
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: false },
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      prismaService.user.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user is already inactive', async () => {
      // Arrange
      prismaService.user.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
