import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateGymService } from "../../../services/factories/make-create-gym-service";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBody = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),

    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { title, phone, description, latitude, longitude } =
    createGymBody.parse(request.body);

  const Service = makeCreateGymService();

  await Service.execute({
    title,
    phone,
    description,
    latitude,
    longitude,
  });

  return reply.status(201).send();
}
