import mockDb from "@/db/mockDb";
import { seed } from "@/db/seed";

export async function setup() {
    console.log("SEEEEEEEEEEEDING FROM GLOBAL SETUP");
    await seed(mockDb, 3);
    const blogs = await mockDb.blog.findMany();
    const users = await mockDb.user.findMany();
    console.log("before all blgos GLOBAL SETUP: ", blogs, users);
}
