import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { UserRegisterService } from "../user-register";

export function makeRegisterService() {
  const userRepository = new PrismaUsersRepository();
  const userRegisterService = new UserRegisterService(userRepository);

  return userRegisterService;
}
