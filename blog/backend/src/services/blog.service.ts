import { logger } from "@/utils/logger";


export const getDummyBlog = async () => {
    logger.info("Fetching dummy blog post");

    return {
        id: 1,
        title: "Hello Dummy Blog",
        content: "This is a sample blog post",
    }
};
