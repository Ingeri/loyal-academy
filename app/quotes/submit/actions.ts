"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function submitQuote(formData: FormData) {
  const authorName = (formData.get("authorName") as string)?.trim();
  const authorRole = (formData.get("authorRole") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const imageFile = formData.get("image") as File | null;

  if (!authorName || !content) {
    throw new Error("Name and quote text are required.");
  }

  if (content.length > 600) {
    throw new Error("Quote is too long. Please keep it under 600 characters.");
  }

  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      throw new Error("File must be an image.");
    }

    if (imageFile.size > 4 * 1024 * 1024) {
      throw new Error("Image must be smaller than 4MB.");
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(imageFile.name) || ".jpg";
    const fileName = `${randomUUID()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "quotes");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    imageUrl = `/uploads/quotes/${fileName}`;
  }

  await prisma.quote.create({
    data: {
      authorName,
      authorRole: authorRole || null,
      content,
      imageUrl,
      status: "PENDING",
    },
  });

  redirect("/quotes/submit/thank-you");
}