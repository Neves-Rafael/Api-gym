import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserRegisterService } from "../../services/user-register";
import { PrismaUsersRepository } from "../../repositories/prisma-users-repository";

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
    return reply.status(409).send();
  }

  return reply.status(201).send();
}
