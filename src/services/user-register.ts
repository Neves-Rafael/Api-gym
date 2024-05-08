import { hash } from "bcryptjs";
import { UsersRepository } from "../repositories/users-interface";

interface userRegisterProps {
  name: string;
  email: string;
  password: string;
}

export class UserRegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: userRegisterProps) {
    const password_hash = await hash(password, 6);

    const emailAlreadyExist = await this.usersRepository.findByEmail(email);

    if (emailAlreadyExist) {
      throw new Error("E-mail already exist");
    }

    await this.usersRepository.create({
      email,
      name,
      password_hash,
    });
  }
}
