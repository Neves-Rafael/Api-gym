import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCheckInService } from "../../../services/factories/make-check-in-service";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),

    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);
  const { gymId } = createCheckInParamsSchema.parse(request.params);

  const createCheckInService = makeCheckInService();

  await createCheckInService.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
