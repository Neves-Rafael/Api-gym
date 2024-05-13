import { test, expect, describe, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "../../repositories/in-memory/in-memory-check-ins.repository";
import { CheckInService } from "../check-ins";
import { InMemoryGymsRepository } from "../../repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe("Check-in Service", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gym-01",
      description: "gyms gym",
      title: "gyms gym",
      phone: "4002-8922",
      latitude: new Decimal(-15.9393152),
      longitude: new Decimal(-48.0307621),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("be able to check-in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -15.9393152,
      userLongitude: -48.0307621,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  test("not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -15.9393152,
      userLongitude: -48.0307621,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -15.9393152,
        userLongitude: -48.0307621,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  test("be able to check in twice in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -15.9393152,
      userLongitude: -48.0307621,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -15.9393152,
      userLongitude: -48.0307621,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });

  test("not be able to check-in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      description: "gyms gym",
      title: "gyms gym",
      phone: "4002-8922",
      latitude: new Decimal(-15.8186217),
      longitude: new Decimal(-48.0113388),
    });

    await expect(
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -15.9393152,
        userLongitude: -48.0307621,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
