"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// NOTE: Add your existing auth/session check at the top of each action below
// (the same one your other admin actions use) before this goes to production.

export async function approveQuote(quoteId: string) {
  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      status: "APPROVED",
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin/quotes");
  revalidatePath("/quotes");
  revalidatePath("/");
}

export async function rejectQuote(quoteId: string) {
  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin/quotes");
}

export async function toggleFeaturedQuote(quoteId: string, featured: boolean) {
  await prisma.quote.update({
    where: { id: quoteId },
    data: { featured },
  });

  revalidatePath("/admin/quotes");
  revalidatePath("/");
}