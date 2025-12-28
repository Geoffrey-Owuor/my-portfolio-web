"use server";
import { revalidateTag } from "next/cache";

const revalidateBlogsData = async () => {
  revalidateTag("BlogsData");
};

export default revalidateBlogsData;
