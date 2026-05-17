'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { UserRole } from '@prisma/client';
import { Loader2, Mail, Calendar, Award, BookOpen } from 'lucide-react';

interface UserDetailsModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserDetails {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  enrollments: Array<{
    id: string;
    course: {
      title: string;
      slug: string;
    };
    createdAt: string;
    progress: number;
  }>;
  certificates: Array<{
    id: string;
    certificateNumber: string;
    issueDate: string;
    grade: string;
    finalScore: number;
    course: {
      title: string;
    };
  }>;
}

export function UserDetailsModal({ userId, open, onOpenChange }: UserDetailsModalProps) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && userId) {
      fetchUserDetails();
    }
  }, [open, userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : error ? (
          <div className='text-center py-12 text-destructive'>
            {error}
          </div>
        ) : user ? (
          <div className='space-y-6'>
            {/* Basic Info */}
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>Basic Information</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Name</p>
                  <p className='font-medium'>{user.name || '-'}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Email</p>
                  <p className='font-medium flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
                    {user.email}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Role</p>
                  <Badge variant='outline' className='capitalize'>
                    {user.role.toLowerCase().replace('_', ' ')}
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Status</p>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Joined</p>
                  <p className='font-medium flex items-center gap-2'>
                    <Calendar className='h-4 w-4' />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Last Updated</p>
                  <p className='font-medium'>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Enrollments */}
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <BookOpen className='h-5 w-5' />
                Enrollments ({user.enrollments.length})
              </h3>
              {user.enrollments.length > 0 ? (
                <div className='space-y-3'>
                  {user.enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'
                    >
                      <div>
                        <p className='font-medium'>{enrollment.course.title}</p>
                        <p className='text-sm text-muted-foreground'>
                          Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant='outline'>{enrollment.progress.toFixed(0)}% complete</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground text-center py-4'>No enrollments yet</p>
              )}
            </Card>

            {/* Certificates */}
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Award className='h-5 w-5' />
                Certificates ({user.certificates.length})
              </h3>
              {user.certificates.length > 0 ? (
                <div className='space-y-3'>
                  {user.certificates.map((certificate) => (
                    <div
                      key={certificate.id}
                      className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'
                    >
                      <div>
                        <p className='font-medium'>{certificate.course.title}</p>
                        <p className='text-sm text-muted-foreground'>
                          {certificate.certificateNumber} • Grade: {certificate.grade}
                        </p>
                      </div>
                      <Badge variant='default'>
                        Score: {certificate.finalScore.toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground text-center py-4'>No certificates yet</p>
              )}
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
