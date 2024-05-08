import { FastifyInstance } from "fastify";
import { userRegister } from "./controllers/register";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", userRegister);
}
