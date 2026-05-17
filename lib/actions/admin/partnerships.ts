'use server';

import { prisma } from '@/lib/prisma';
import { checkAdminAccess, validateUUID } from '../admin';
import { PartnershipType, PartnershipStatus } from '@prisma/client';

/**
 * Get all partnerships
 */
export async function getPartnerships(status?: PartnershipStatus) {
  await checkAdminAccess();

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const partnerships = await prisma.partnership.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return partnerships;
}

/**
 * Create partnership
 */
export async function createPartnership(data: {
  companyName: string;
  contactEmail: string;
  contactName: string;
  partnershipType: PartnershipType;
  description: string;
  websiteUrl?: string;
}) {
  await checkAdminAccess();

  const partnership = await prisma.partnership.create({
    data,
  });

  return partnership;
}

/**
 * Update partnership
 */
export async function updatePartnership(id: string, data: any) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  const partnership = await prisma.partnership.update({
    where: { id: validatedId },
    data,
  });

  return partnership;
}

/**
 * Delete partnership
 */
export async function deletePartnership(id: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  await prisma.partnership.delete({
    where: { id: validatedId },
  });

  return { success: true, message: 'Partnership deleted successfully' };
}

/**
 * Approve partnership
 */
export async function approvePartnership(id: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  const partnership = await prisma.partnership.update({
    where: { id: validatedId },
    data: { status: PartnershipStatus.APPROVED },
  });

  return partnership;
}

/**
 * Reject partnership
 */
export async function rejectPartnership(id: string) {
  await checkAdminAccess();
  const validatedId = await validateUUID(id);

  const partnership = await prisma.partnership.update({
    where: { id: validatedId },
    data: { status: PartnershipStatus.REJECTED },
  });

  return partnership;
}
