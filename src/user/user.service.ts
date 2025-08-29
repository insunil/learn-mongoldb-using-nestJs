import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectId } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: MongoRepository<User>) {
  }

  async create(createUserDto: CreateUserDto) {
   return await this.userRepository.save(createUserDto).catch((err: any) => { throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR) });
  }
  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(_id: string) {
    return await this.userRepository.find({ _id: new ObjectId(_id) });
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ "email": email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
     return user;
  }

 async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.userRepository.update({ _id: new ObjectId(id) }, updateUserDto);
      if (result.raw.matchedCount == 0) {
        throw new HttpException('User not exists', HttpStatus.NOT_FOUND);
      }
      return await this.userRepository.findOneBy({ _id: new ObjectId(id) });
    } catch (err: any) {
      if (err?.code == 11000) {
        throw new ConflictException('Email already exist ');
      }
      throw new InternalServerErrorException('Database error: ' + err.message);
    }
  }


  async remove(id: string) {
    return await this.userRepository.deleteOne({ "_id": new ObjectId(id) })
  }
}
