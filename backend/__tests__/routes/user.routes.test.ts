import request from "supertest"

import app from "../../index"

import { validateUser } from "../../controllers/UserController"
import { InitializeDatabase } from "../../db/DatabaseInit"

// TODO: Study how should this be tested properly. This test fails on opening server and connection to DB

const user = {
    userName: "Vexi",
    password: "TestiPassu"
}
const TOKEN = validateUser(user)

beforeAll(() => {
    return InitializeDatabase();
});
  
afterAll(() => {
    return InitializeDatabase();
});

describe("User Routes", () => {
    test("Get Token for User",async () => {
        const res = await request(app).get("/warbands/publicWarbands").set("Authorization", `bearer ${TOKEN}`);
        expect(res.statusCode).toBe(200)
    })
})