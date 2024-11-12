"use server";

import { revalidatePath } from "next/cache";

export async function revalidateFramesV2() {
  revalidatePath("/framesV2");
}
