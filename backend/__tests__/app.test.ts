import request from "supertest"

import app from "../index"


describe("Test index.ts", () => {
    test("Test version route",async () => {
        const res = await request(app).get("/version");
        expect(res.text).toBe("Version 0.1")
    })
})