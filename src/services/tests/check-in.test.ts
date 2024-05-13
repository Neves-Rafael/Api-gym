import { test, expect, describe, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "../../repositories/in-memory/in-memory-check-in.repository";
import { CheckInService } from "../check-ins";

let CheckInsRepository: InMemoryCheckInsRepository;
let sut: CheckInService;

describe("Check-in Service", () => {
  beforeEach(() => {
    CheckInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInService(CheckInsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("able to check-in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  test("not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  test("be able to check in twice in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });
});
