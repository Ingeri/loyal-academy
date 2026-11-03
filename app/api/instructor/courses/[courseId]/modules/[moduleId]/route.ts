import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

type RouteContext = {
  params: Promise<{
    courseId: string;
    moduleId: string;
  }>;
};

// =========================================================
// GET ONE MODULE
// =========================================================

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { courseId, moduleId } =
      await context.params;

    // =====================================================
    // VALIDATE PARAMETERS
    // =====================================================

    if (!courseId || !moduleId) {
      return NextResponse.json(
        {
          error:
            "Missing courseId or moduleId",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // =====================================================
    // VERIFY COURSE
    // =====================================================

    const course =
      await prisma.course.findUnique({
        where: {
          id: courseId,
        },

        select: {
          id: true,
          instructorId: true,
        },
      });

    if (!course) {
      return NextResponse.json(
        {
          error: "Course not found",
        },
        {
          status: 404,
        },
      );
    }

    // =====================================================
    // VERIFY COURSE OWNERSHIP
    // =====================================================

    if (
      course.instructorId !==
      session.userId
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }

    // =====================================================
    // GET MODULE
    // =====================================================

    const module =
      await prisma.module.findFirst({
        where: {
          id: moduleId,
          courseId,
        },

        include: {
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      });

    if (!module) {
      return NextResponse.json(
        {
          error: "Module not found",
        },
        {
          status: 404,
        },
      );
    }

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json(
      {
        module,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Get module error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to get module",
      },
      {
        status: 500,
      },
    );
  }
}

// =========================================================
// UPDATE MODULE
// =========================================================

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { courseId, moduleId } =
      await context.params;

    // =====================================================
    // VALIDATE PARAMETERS
    // =====================================================

    if (!courseId || !moduleId) {
      return NextResponse.json(
        {
          error:
            "Missing courseId or moduleId",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // =====================================================
    // VERIFY COURSE
    // =====================================================

    const course =
      await prisma.course.findUnique({
        where: {
          id: courseId,
        },

        select: {
          id: true,
          instructorId: true,
        },
      });

    if (!course) {
      return NextResponse.json(
        {
          error: "Course not found",
        },
        {
          status: 404,
        },
      );
    }

    // =====================================================
    // VERIFY COURSE OWNERSHIP
    // =====================================================

    if (
      course.instructorId !==
      session.userId
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }

    // =====================================================
    // VERIFY MODULE
    // =====================================================

    const existingModule =
      await prisma.module.findFirst({
        where: {
          id: moduleId,
          courseId,
        },

        select: {
          id: true,
          title: true,
          description: true,
        },
      });

    if (!existingModule) {
      return NextResponse.json(
        {
          error: "Module not found",
        },
        {
          status: 404,
        },
      );
    }

    // =====================================================
    // READ REQUEST BODY
    // =====================================================

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON body",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !body ||
      typeof body !== "object"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid request payload: expected JSON object",
        },
        {
          status: 400,
        },
      );
    }

    const { title, description } =
      body as {
        title?: string;
        description?: string;
      };

    // =====================================================
    // VALIDATE TITLE
    // =====================================================

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Module title is required",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================================
    // VALIDATE DESCRIPTION
    // =====================================================

    if (
      typeof description !== "string" ||
      !description.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Module description is required",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================================
    // UPDATE SAME MODULE
    // =====================================================

    const updatedModule =
      await prisma.module.update({
        where: {
          id: moduleId,
        },

        data: {
          title: title.trim(),
          description:
            description.trim(),
        },
      });

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json(
      {
        message:
          "Module updated successfully",
        module: updatedModule,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Module update error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to update module",
      },
      {
        status: 500,
      },
    );
  }
}

// =========================================================
// DELETE MODULE
// =========================================================

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { courseId, moduleId } =
      await context.params;

    // =====================================================
    // VALIDATE PARAMETERS
    // =====================================================

    if (!courseId || !moduleId) {
      return NextResponse.json(
        {
          error:
            "Missing courseId or moduleId",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // =====================================================
    // VERIFY COURSE
    // =====================================================

    const course =
      await prisma.course.findUnique({
        where: {
          id: courseId,
        },

        select: {
          id: true,
          instructorId: true,
        },
      });

    if (!course) {
      return NextResponse.json(
        {
          error: "Course not found",
        },
        {
          status: 404,
        },
      );
    }

    // =====================================================
    // VERIFY COURSE OWNERSHIP
    // =====================================================

    if (
      course.instructorId !==
      session.userId
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }

    // =====================================================
    // VERIFY MODULE
    // =====================================================

    const existingModule =
      await prisma.module.findFirst({
        where: {
          id: moduleId,
          courseId,
        },

        select: {
          id: true,
        },
      });

    if (!existingModule) {
      return NextResponse.json(
        {
          error: "Module not found",
        },
        {
          status: 404,
        },
      );
    }

    // =====================================================
    // DELETE MODULE
    // =====================================================

    await prisma.module.delete({
      where: {
        id: moduleId,
      },
    });

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json(
      {
        message:
          "Module deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Module deletion error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete module",
      },
      {
        status: 500,
      },
    );
  }
}