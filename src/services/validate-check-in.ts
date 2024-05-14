import { CheckInsRepository } from "../repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./erros/resource-not-found";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./erros/late-check-in-validation-error";

interface ValidateCheckInServiceRequest {
  checkInId: string;
}

interface ValidateCheckInServiceResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes",
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
