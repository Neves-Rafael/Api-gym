import request from "supertest";
import { app } from "../../../../app";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createAndAuthenticateUser } from "../../../../utils/tests/create-and-authenticate-user";

describe("Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  test("be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description",
        phone: "61999999999",
        latitude: -15.9393152,
        longitude: -48.0307621,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TypeScript Gym",
        description: "Some description",
        phone: "61999999999",
        latitude: -14.9393152,
        longitude: -46.0307621,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -15.9393152,
        longitude: -48.0307621,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript Gym",
      }),
    ]);
  });
});
