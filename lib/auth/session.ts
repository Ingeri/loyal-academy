import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const secretKey = process.env.AUTH_SECRET;

if (!secretKey) {
  throw new Error('AUTH_SECRET must be configured before starting the Next.js server.');
}

const key = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  email: string;
  role: string;
  expires: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, email: string, role: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ userId, email, role, expires });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  });

  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  return await decrypt(session);
}

export async function getUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      avatarUrl: true,
    },
  } as any);

  return user;
}

export async function updateSession() {
  const session = await getSession();
  if (!session) return null;

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const newSession = await encrypt({
    userId: session.userId,
    email: session.email,
    role: session.role,
    expires,
  });

  const cookieStore = await cookies();
  cookieStore.set('session', newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  });

  return newSession;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
