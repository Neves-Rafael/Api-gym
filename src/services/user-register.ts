import { hash } from "bcryptjs";
import { prisma } from "../lib/prisma";

interface userRegisterProps {
  name: string;
  email: string;
  password: string;
}

export class UserRegisterService {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: userRegisterProps) {
    const password_hash = await hash(password, 6);

    const emailAlreadyExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

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
