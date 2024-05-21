import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeValidadeCheckInService } from "../../../services/factories/make-validate-check-in-service";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  const validateCheckInService = makeValidadeCheckInService();

  await validateCheckInService.execute({
    checkInId,
  });

  return reply.status(204).send();
}
