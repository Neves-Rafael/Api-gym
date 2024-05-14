import { test, expect, describe, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../../repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsService } from "../fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;

describe("Fetch Nearby Gyms Service", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsService(gymsRepository);
  });

  test("be able to fetch for nearby gyms", async () => {
    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -14.9393152,
      longitude: -47.0307621,
    });

    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -15.9393152,
      longitude: -48.0307621,
    });

    const { gyms } = await sut.execute({
      userLatitude: -15.9393152,
      userLongitude: -48.0307621,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
