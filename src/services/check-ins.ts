import { CheckInsRepository } from "../repositories/check-ins-repository";
import { GymsRepository } from "../repositories/gyms-repository";
import { InvalidCredentialsError } from "./erros/invalid-credentials-error";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./erros/resource-not-found";
import { getDistanceBetweenCoordinates } from "../utils/get-distance-between-coordinades";

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInServiceResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error();
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDay) {
      throw new Error();
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    if (!checkIn) {
      throw new InvalidCredentialsError();
    }

    return { checkIn };
  }
}
