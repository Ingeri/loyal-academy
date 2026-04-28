'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Upload, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const steps = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'media', label: 'Media' },
  { id: 'syllabus', label: 'Syllabus' },
  { id: 'settings', label: 'Settings' },
];

const categories = [
  'Computer Science',
  'Business',
  'Law',
  'Design',
  'Data Science',
  'Cloud',
  'Web Development',
  'AI & ML',
  'Cybersecurity',
  'Languages',
];

export default function NewCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modules, setModules] = useState([{ title: '', lessons: 1, duration: '' }]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    price: '',
    duration_weeks: '',
    image_url: '',
    is_published: false,
    certificate_enabled: true,
  });

  const addModule = () => {
    setModules([...modules, { title: '', lessons: 1, duration: '' }]);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const updateModule = (index: number, field: string, value: string | number) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, modules }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push('/admin/courses');
      } else {
        alert('Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.title && formData.description && formData.category && formData.level;
      case 1:
        return true; // Media is optional
      case 2:
        return modules.every(m => m.title);
      case 3:
        return formData.price !== '';
      default:
        return true;
    }
  };

  return (
    <div className='space-y-6 max-w-4xl'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link href='/admin/courses'>
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-5 w-5' />
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Create New Course</h1>
          <p className='text-muted-foreground'>Build your course in a few simple steps</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className='flex items-center gap-2'>
        {steps.map((step, index) => (
          <div key={step.id} className='flex items-center'>
            <div
              className={lex items-center justify-center w-8 h-8 rounded-full text-sm font-medium }
            >
              {index < currentStep ? <Check className='h-4 w-4' /> : index + 1}
            </div>
            <span
              className={ml-2 text-sm font-medium }
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className='h-4 w-4 mx-2 text-muted-foreground' />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className='p-6'>
        {currentStep === 0 && (
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold'>Basic Information</h2>

            <div className='space-y-2'>
              <Label htmlFor='title'>Course Title *</Label>
              <Input
                id='title'
                placeholder='e.g., Advanced Web Development'
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description *</Label>
              <Textarea
                id='description'
                placeholder='Describe what students will learn...'
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Level *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='beginner'>Beginner</SelectItem>
                    <SelectItem value='intermediate'>Intermediate</SelectItem>
                    <SelectItem value='advanced'>Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='price'>Price (USD) *</Label>
                <Input
                  id='price'
                  type='number'
                  placeholder='49.99'
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='duration'>Duration (weeks)</Label>
                <Input
                  id='duration'
                  type='number'
                  placeholder='8'
                  value={formData.duration_weeks}
                  onChange={(e) => setFormData({ ...formData, duration_weeks: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold'>Course Media</h2>

            <div className='space-y-2'>
              <Label>Thumbnail Image</Label>
              <div className='border-2 border-dashed border-muted rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer'>
                <Upload className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>
                  Drag and drop an image here, or click to browse
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Recommended: 1280x720px, max 5MB
                </p>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='image_url'>Or enter image URL</Label>
              <Input
                id='image_url'
                placeholder='https://example.com/image.jpg'
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>Course Syllabus</h2>
              <Button type='button' variant='outline' size='sm' onClick={addModule} className='gap-2'>
                <Plus className='h-4 w-4' />
                Add Module
              </Button>
            </div>

            <div className='space-y-4'>
              {modules.map((module, index) => (
                <Card key={index} className='p-4'>
                  <div className='flex items-start gap-4'>
                    <Badge variant='outline' className='mt-1'>Module {index + 1}</Badge>
                    <div className='flex-1 space-y-3'>
                      <Input
                        placeholder='Module title'
                        value={module.title}
                        onChange={(e) => updateModule(index, 'title', e.target.value)}
                      />
                      <div className='flex gap-3'>
                        <Input
                          type='number'
                          placeholder='Lessons'
                          className='w-24'
                          value={module.lessons}
                          onChange={(e) => updateModule(index, 'lessons', parseInt(e.target.value) || 1)}
                        />
                        <Input
                          placeholder='Duration (e.g., 2 hours)'
                          value={module.duration}
                          onChange={(e) => updateModule(index, 'duration', e.target.value)}
                        />
                      </div>
                    </div>
                    {modules.length > 1 && (
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-destructive'
                        onClick={() => removeModule(index)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold'>Settings</h2>

            <div className='flex items-center justify-between p-4 border rounded-lg'>
              <div>
                <Label htmlFor='published' className='font-medium'>Publish Course</Label>
                <p className='text-sm text-muted-foreground'>
                  Make this course available to students
                </p>
              </div>
              <Switch
                id='published'
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
            </div>

            <div className='flex items-center justify-between p-4 border rounded-lg'>
              <div>
                <Label htmlFor='certificate' className='font-medium'>Enable Certificates</Label>
                <p className='text-sm text-muted-foreground'>
                  Issue certificates upon course completion
                </p>
              </div>
              <Switch
                id='certificate'
                checked={formData.certificate_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, certificate_enabled: checked })}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className='flex justify-between'>
        <Button
          variant='outline'
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className='gap-2'
        >
          <ChevronLeft className='h-4 w-4' />
          Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed()}
            className='gap-2'
          >
            Next
            <ChevronRight className='h-4 w-4' />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className='gap-2'
          >
            {isSubmitting ? 'Creating...' : 'Create Course'}
            <Check className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}

