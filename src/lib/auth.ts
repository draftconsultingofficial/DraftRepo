import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { StaffUserModel } from "@/models/StaffUser";
import { connectToDatabase } from "@/lib/db";

export type UserRole = "main_admin" | "contributor";

export type SessionUser = {
  email: string;
  role: UserRole;
};

const SESSION_COOKIE = "draft_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("Missing AUTH_SECRET environment variable.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getSecret());
    const session = verified.payload as SessionUser;

    if (session.role === "main_admin") {
      const mainAdminEmail = process.env.MAIN_ADMIN_EMAIL?.trim().toLowerCase();
      if (session.email === mainAdminEmail) {
        return session;
      }
      return null;
    }

    await connectToDatabase();
    const staffUser = await StaffUserModel.findOne({
      email: session.email,
    }).lean();

    if (!staffUser || !staffUser.active) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireMainAdmin() {
  const session = await requireSession();

  if (session.role !== "main_admin") {
    redirect("/admin");
  }

  return session;
}

export async function authenticateUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  await connectToDatabase();

  const staffUser = await StaffUserModel.findOne({
    email: normalizedEmail,
    active: true,
  }).lean();

  if (staffUser) {
    const matches = await bcrypt.compare(password, staffUser.passwordHash);
    if (matches) {
      return {
        email: staffUser.email,
        role: staffUser.role as UserRole,
      };
    }
  }

  const mainAdminEmail = process.env.MAIN_ADMIN_EMAIL?.trim().toLowerCase();
  const mainAdminPassword = process.env.MAIN_ADMIN_PASSWORD;

  if (
    mainAdminEmail &&
    mainAdminPassword &&
    normalizedEmail === mainAdminEmail &&
    password === mainAdminPassword
  ) {
    return {
      email: normalizedEmail,
      role: "main_admin" as const,
    };
  }

  return null;
}
