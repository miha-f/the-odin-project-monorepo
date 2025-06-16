import { beforeAll } from "vitest";
import mockDb from "@/db/mockDb";
import { seed } from "@/db/seed";

beforeAll(async () => {
    console.log("SEEEEEEEEEEEDING");
    await seed(mockDb, 3);
    const blogs = await mockDb.blog.findMany();
    console.log("before all blgos: ", blogs);
});
