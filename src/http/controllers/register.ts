import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserRegisterService } from "../../services/user-register";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { UseAlreadyExistError } from "../../services/erros/user-already-exist-error";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = userSchema.parse(request.body);

  try {
    const userRepository = new PrismaUsersRepository();
    const userRegisterService = new UserRegisterService(userRepository);

    await userRegisterService.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UseAlreadyExistError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
