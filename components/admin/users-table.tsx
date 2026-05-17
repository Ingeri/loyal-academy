'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { UserActionsMenu } from './user-actions-menu';
import { UserDetailsModal } from './user-details-modal';
import { UserRole } from '@prisma/client';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  _count: {
    enrollments: number;
    certificates: number;
  };
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  return (
    <>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-muted/50'>
            <tr>
              <th className='text-left p-4 font-medium text-sm text-muted-foreground'>Email</th>
              <th className='text-left p-4 font-medium text-sm text-muted-foreground'>Name</th>
              <th className='text-left p-4 font-medium text-sm text-muted-foreground'>Role</th>
              <th className='text-left p-4 font-medium text-sm text-muted-foreground'>Status</th>
              <th className='text-left p-4 font-medium text-sm text-muted-foreground'>Enrollments</th>
              <th className='text-left p-4 font-medium text-sm text-muted-foreground'>Certificates</th>
              <th className='text-left p-4 font-medium text-sm text-muted-foreground'>Joined</th>
              <th className='text-right p-4 font-medium text-sm text-muted-foreground'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className='border-t hover:bg-muted/30'>
                <td className='p-4 text-sm'>{user.email}</td>
                <td className='p-4 text-sm font-medium'>{user.name || '-'}</td>
                <td className='p-4'>
                  <Badge variant='outline' className='capitalize'>
                    {user.role.toLowerCase().replace('_', ' ')}
                  </Badge>
                </td>
                <td className='p-4'>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className='p-4 text-sm'>{user._count.enrollments}</td>
                <td className='p-4 text-sm'>{user._count.certificates}</td>
                <td className='p-4 text-sm text-muted-foreground'>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className='p-4 text-right'>
                  <UserActionsMenu
                    userId={user.id}
                    isActive={user.isActive}
                    onViewDetails={() => handleViewDetails(user.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          open={isModalOpen}
          onOpenChange={handleCloseModal}
        />
      )}
    </>
  );
}
