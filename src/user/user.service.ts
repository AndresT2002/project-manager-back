import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from 'src/models/user.entity';
import {
  CreateUserDto,
  CreateUserResponseDto,
  GetUserResponseDto,
  GetUsersQueryDto,
  GetUsersResponseDto,
  UpdateUserDto,
  UpdateUserResponseDto,
} from 'src/models/dtos/user';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email.toLowerCase().trim() },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    // Guardar el usuario antes de retornarlo
    const savedUser = await this.userRepository.save(newUser);

    return plainToInstance(CreateUserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(query: GetUsersQueryDto): Promise<GetUsersResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    // Construir condiciones de búsqueda
    const whereConditions: Record<string, unknown> = {};
    console.log(query);
    // Filtros básicos
    if (query.role) whereConditions.role = query.role;
    if (query.isActive !== undefined) whereConditions.isActive = query.isActive;
    if (query.createdBy) whereConditions.createdBy = query.createdBy;

    // Validar campo de ordenamiento
    const allowedSortFields = [
      'id',
      'name',
      'lastName',
      'fullName',
      'email',
      'role',
      'isActive',
      'createdAt',
      'updatedAt',
    ];
    const sortBy = allowedSortFields.includes(query.sortBy ?? 'createdAt')
      ? (query.sortBy ?? 'createdAt')
      : 'createdAt';
    const sortOrder = query.sortOrder ?? 'DESC';

    // Construir condiciones de búsqueda con soporte para búsqueda por texto
    let whereClause: Record<string, unknown> | Record<string, unknown>[] =
      whereConditions;

    if (query.search) {
      whereClause = [
        { ...whereConditions, name: ILike(`%${query.search}%`) },
        { ...whereConditions, lastName: ILike(`%${query.search}%`) },
        { ...whereConditions, fullName: ILike(`%${query.search}%`) },
        { ...whereConditions, email: ILike(`%${query.search}%`) },
      ];
    }

    // Obtener el total de registros con filtros
    const total = await this.userRepository.count({
      where: whereClause,
    });

    // Obtener los registros de la página actual
    const users = await this.userRepository.find({
      skip,
      take: pageSize,
      where: whereClause,
      order: {
        [sortBy]: sortOrder,
      },
    });

    const userDtos = plainToInstance(GetUserResponseDto, users, {
      excludeExtraneousValues: true,
    });

    const totalPages = Math.ceil(total / pageSize);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data: userDtos,
      meta: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext,
        hasPrevious,
        itemCount: users.length,
      },
    };
  }

  async findOne(id: string): Promise<GetUserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(GetUserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return plainToInstance(UpdateUserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return true;
  }
}
