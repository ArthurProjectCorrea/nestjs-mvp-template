import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserResponseDto,
  UsersListResponseDto,
  ErrorResponseDto,
  ConflictErrorResponseDto,
  NotFoundErrorResponseDto,
} from './dto/response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user with the provided information. Email must be unique.',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'User with this email already exists',
    type: ConflictErrorResponseDto,
  })
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active users',
    description:
      'Retrieves a list of all active users in the system, sorted by creation date (newest first).',
  })
  @ApiOkResponse({
    description: 'List of active users retrieved successfully',
    type: UsersListResponseDto,
  })
  async findAll(): Promise<UsersListResponseDto> {
    const users = await this.usersService.findAll();
    return { data: users };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their unique ID.',
  })
  @ApiOkResponse({
    description: 'User found successfully',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID format',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: NotFoundErrorResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user by ID',
    description:
      'Updates a user with the provided information. All fields are optional.',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or user ID format',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: NotFoundErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email is already in use by another user',
    type: ConflictErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft delete user by ID',
    description:
      'Performs a soft delete on a user, marking them as inactive instead of removing from database.',
  })
  @ApiOkResponse({
    description: 'User soft deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID format',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found or already deleted',
    type: NotFoundErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
