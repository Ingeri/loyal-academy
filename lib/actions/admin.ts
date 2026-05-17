'use server';

import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { z } from 'zod';

/**
 * Security helper to check if the current user has ADMIN role
 * Must be called in every admin server action before any database operations
 * @throws Error if user is not authenticated or not an admin
 */
export async function checkAdminAccess() {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/login?redirect=/admin');
  }
  
  if (session.role !== 'ADMIN') {
    throw new Error('Access denied: Admin role required');
  }
  
  return session;
}

/**
 * UUID validation using Zod
 * Validates that a string is a valid PostgreSQL UUID format
 * Prevents database crashes from malformed UUID strings
 */
const uuidSchema = z.string().uuid();

/**
 * Validate a UUID string
 * @param id - The UUID string to validate
 * @returns The validated UUID string
 * @throws Error if the UUID is invalid
 */
export async function validateUUID(id: string): Promise<string> {
  try {
    return uuidSchema.parse(id);
  } catch (error) {
    throw new Error(`Invalid UUID format: ${id}`);
  }
}

/**
 * Validate multiple UUIDs at once
 * @param ids - Array of UUID strings to validate
 * @returns Array of validated UUID strings
 * @throws Error if any UUID is invalid
 */
export async function validateUUIDs(ids: string[]): Promise<string[]> {
  return Promise.all(ids.map(validateUUID));
}
