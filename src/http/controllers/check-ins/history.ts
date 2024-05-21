import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchUserCheckInsHistoryService } from "../../../services/factories/make-fetch-user-check-ins-history-service";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const fetchCheckInHistorySe = makeFetchUserCheckInsHistoryService();

  const { checkIns } = await fetchCheckInHistorySe.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(201).send({
    checkIns,
  });
}
