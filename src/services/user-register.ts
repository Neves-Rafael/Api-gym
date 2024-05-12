import { hash } from "bcryptjs";
import { UsersRepository } from "../repositories/users-repository";
import { UseAlreadyExistError } from "./erros/user-already-exist-error";
import { User } from "@prisma/client";

interface userRegisterProps {
  name: string;
  email: string;
  password: string;
}

interface userRegisterResponse {
  user: User;
}

export class UserRegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: userRegisterProps): Promise<userRegisterResponse> {
    const password_hash = await hash(password, 6);

    const emailAlreadyExist = await this.usersRepository.findByEmail(email);

    if (emailAlreadyExist) {
      throw new UseAlreadyExistError();
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    });

    return {
      user,
    };
  }
}
