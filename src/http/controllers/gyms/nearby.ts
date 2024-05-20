import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchNearbyGymsService } from "../../../services/factories/make-fetch-nearby-gyms-service";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQUerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),

    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymsQUerySchema.parse(request.body);

  const fetchNearbyGymsService = makeFetchNearbyGymsService();

  await fetchNearbyGymsService.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
