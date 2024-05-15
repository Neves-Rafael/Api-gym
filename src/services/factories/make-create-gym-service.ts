import { PrismaGymsRepository } from "../../repositories/prisma/prisma-gyms-repository";
import { CreateGymService } from "../create-gym";

export function makeCreateGymService() {
  const gymsRepository = new PrismaGymsRepository();
  const service = new CreateGymService(gymsRepository);

  return service;
}
