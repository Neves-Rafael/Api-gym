import { CheckInsRepository } from "../repositories/check-ins-repository";
import { InvalidCredentialsError } from "./erros/invalid-credentials-error";
import { CheckIn } from "@prisma/client";

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
}

interface CheckInServiceResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(private CheckInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const checkIn = await this.CheckInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    if (!checkIn) {
      throw new InvalidCredentialsError();
    }

    return { checkIn };
  }
}
