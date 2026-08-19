import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import DashboardRedirectClient from "@/components/dashboard/DashboardRedirectClient";

async function getUserRole() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "");
    const { payload } = await jwtVerify(sessionCookie, secret);
    
    // Log payload during development to verify what key holds the role
    console.log("JWT Payload Decoded:", payload);

    // Look for role inside payload, user object, or metadata depending on how createSession built it
    const role = (payload.role as string) || (payload.user as any)?.role;
    return role ? role.toUpperCase() : null;
  } catch (error) {
    console.error("Session verification failed in dashboard:", error);
    return null; // Return null instead of forcing "STUDENT" so we can handle it safely
  }
}

export default async function DashboardPage() {
  const role = await getUserRole();

  // If session is missing or invalid, send them to login cleanly
  if (!role) {
    redirect("/auth/login");
  }

  // Determine target path dynamically based on exact role string
  let targetUrl = "/student";
  switch (role) {
    case "STUDENT":
      targetUrl = "/student";
      break;
    case "INSTRUCTOR":
      targetUrl = "/instructor";
      break;
    case "ADMIN":
      targetUrl = "/admin";
      break;
    case "CLIENT":
      targetUrl = "/client";
      break;
    case "DONOR":
      targetUrl = "/donor";
      break;
    default:
      targetUrl = "/student";
      break;
  }

  return <DashboardRedirectClient role={role} targetUrl={targetUrl} />;
}