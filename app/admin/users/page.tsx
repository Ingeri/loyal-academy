import { getUsers, updateUserRole, toggleUserActive } from '@/lib/actions/admin/users';
import { UserRole } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Search, Eye, MoreVertical, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UsersTable } from '@/components/admin/users-table';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: UserRole | 'all'; active?: string }>;
}) {
  const params = await searchParams;
  const users = await getUsers(
    params.q,
    params.role && params.role !== 'all' ? (params.role as UserRole) : undefined,
    params.active === 'true' ? true : params.active === 'false' ? false : undefined
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Users</h1>
          <p className='mt-1 text-muted-foreground'>Manage all platform users</p>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className='p-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <form method='get' className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                name='q'
                placeholder='Search by email or name...'
                defaultValue={params.q || ''}
                className='pl-9'
              />
            </div>
          </form>
          <form method='get' className='flex gap-2'>
            <Select name='role' defaultValue={params.role || 'all'}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Roles</SelectItem>
                <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
                <SelectItem value={UserRole.INSTRUCTOR}>Instructor</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.CAREER_ADVISOR}>Career Advisor</SelectItem>
                <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
                <SelectItem value={UserRole.DONOR}>Donor</SelectItem>
              </SelectContent>
            </Select>
            <Select name='active' defaultValue={params.active || 'all'}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='true'>Active</SelectItem>
                <SelectItem value='false'>Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button type='submit' variant='outline'>
              Apply
            </Button>
          </form>
        </div>
      </Card>

      {/* Users Table */}
      {users.length > 0 ? (
        <Card className='overflow-hidden'>
          <UsersTable users={users} />
        </Card>
      ) : (
        <Card className='p-12 text-center'>
          <p className='text-muted-foreground mb-6'>
            {params.q || params.role || params.active
              ? 'No users found matching your filters.'
              : 'No users yet.'}
          </p>
        </Card>
      )}
    </div>
  );
}
