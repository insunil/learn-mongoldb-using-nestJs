import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Any, MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: MongoRepository<User>) {
  }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.userRepo.save(createUserDto);
    } catch (err:any) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(_id: string) {
    return await this.userRepo.find({ _id: new ObjectId(_id) });
  }

  async findByEmail(email: string) {
    console.log("here")
    const user = await this.userRepo.findOneBy({ "email": email } );
  if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }


  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.userRepo.update({ _id: new ObjectId(id) }, updateUserDto);
      if (result.raw.matchedCount == 0) {
        throw new HttpException('User not exists', HttpStatus.NOT_FOUND);
      }
      return await this.userRepo.findOneBy({ _id: new ObjectId(id) });
    } catch (err:any) {
      if (err?.code == 11000) {
        throw new ConflictException('Email already exist ');
      }
      throw new InternalServerErrorException('Database error: ' + err.message);
    }
  }


  async remove(id: string) {
    return await this.userRepo.deleteOne({ "_id": new ObjectId(id) })
  }
}
