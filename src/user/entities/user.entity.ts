import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class User {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  name!: string;

  @Column({ unique: true })  
  email!: string;

  @Column()
  password!: string;

  @Column()
  mobile!: string;

  @Column()
  gender!: string;

  @Column({ nullable: true })
  age?: number;
}

