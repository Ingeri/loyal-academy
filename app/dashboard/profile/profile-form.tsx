'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Mail, Calendar, Edit3, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadAvatar, updateProfile } from '../actions';
import Link from 'next/link';

interface ProfileFormProps {
  user: any;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
  });

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recently';

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadAvatar(formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success('Avatar updated successfully!');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile(formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {/* Avatar Section */}
      <div className="relative group">
        <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-4xl font-black shadow-2xl ring-4 ring-background overflow-hidden">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || 'Avatar'}
              className="w-full h-full object-cover"
            />
          ) : (
            user.name?.charAt(0) || 'U'
          )}
        </div>
        <label
          htmlFor="avatar-upload"
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl"
        >
          <Camera className="h-6 w-6 text-white" />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={isUploading}
          className="hidden"
        />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex-1 text-center md:text-left space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-3xl font-black tracking-tight bg-transparent border-b-2 border-primary focus:outline-none"
              autoFocus
            />
          ) : (
            <h1 className="text-3xl font-black tracking-tight">{user.name || 'Your Name'}</h1>
          )}
          <Badge
            variant="secondary"
            className="w-fit mx-auto md:mx-0 uppercase tracking-widest text-[10px] font-bold"
          >
            {user.role}
          </Badge>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1.5">
            <Mail className="h-4 w-4" /> {user.email}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Joined {joinDate}
          </div>
        </div>

        {isEditing ? (
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            className="w-full text-sm text-muted-foreground bg-transparent border-b border-primary/20 focus:outline-none focus:border-primary resize-none"
            rows={2}
          />
        ) : (
          <p className="text-sm text-muted-foreground">{user.bio || 'No bio added yet'}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              size="sm"
              onClick={() => setIsEditing(false)}
              variant="outline"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-10 w-10 p-0"
              asChild
            >
              <Link href="/dashboard/settings">
                <Share2 className="h-4 w-4" />
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
