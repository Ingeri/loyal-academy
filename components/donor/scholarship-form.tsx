'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ScholarshipType } from '@prisma/client';
import { Loader2, Plus, X } from 'lucide-react';

interface ScholarshipFormProps {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    amount?: number;
    type?: ScholarshipType;
    eligibilityCriteria?: any;
    applicationDeadline?: string;
    maxAwards?: number;
    donorName?: string;
    donorLogoUrl?: string;
  };
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel?: string;
}

export function ScholarshipForm({ 
  initialData, 
  onSubmit,
  submitLabel = 'Create Scholarship'
}: ScholarshipFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  
  // Eligibility criteria state
  const [minGPA, setMinGPA] = useState(initialData?.eligibilityCriteria?.minGPA || 0);
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>(
    initialData?.eligibilityCriteria?.requiredDocuments || []
  );
  const [additionalRequirements, setAdditionalRequirements] = useState(
    initialData?.eligibilityCriteria?.additionalRequirements || ''
  );
  const [minAge, setMinAge] = useState(initialData?.eligibilityCriteria?.minAge || '');
  const [maxAge, setMaxAge] = useState(initialData?.eligibilityCriteria?.maxAge || '');
  const [educationLevel, setEducationLevel] = useState(
    initialData?.eligibilityCriteria?.educationLevel || ''
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(
    initialData?.eligibilityCriteria?.fieldOfStudy || ''
  );
  const [customRequirement, setCustomRequirement] = useState('');
  const [customRequirements, setCustomRequirements] = useState<string[]>(
    initialData?.eligibilityCriteria?.customRequirements || []
  );

  const documentOptions = [
    'Academic Transcript',
    'Letter of Recommendation',
    'Identity Verification',
    'Technical Portfolio / CV',
    'Proof of Enrollment',
    'Financial Need Statement',
    'Essay / Personal Statement'
  ];

  const toggleDocument = (doc: string) => {
    setRequiredDocuments(prev => 
      prev.includes(doc) 
        ? prev.filter(d => d !== doc)
        : [...prev, doc]
    );
  };

  const addCustomRequirement = () => {
    if (customRequirement.trim()) {
      setCustomRequirements(prev => [...prev, customRequirement.trim()]);
      setCustomRequirement('');
    }
  };

  const removeCustomRequirement = (index: number) => {
    setCustomRequirements(prev => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Auto-generate slug only if it's empty or matches the previous title's slug
    if (!slug || generateSlug(title) === slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Build eligibility criteria object
      const eligibilityCriteria = {
        minGPA: parseFloat(minGPA.toString()) || 0,
        requiredDocuments,
        additionalRequirements,
        ...(minAge && { minAge: parseInt(minAge) }),
        ...(maxAge && { maxAge: parseInt(maxAge) }),
        ...(educationLevel && educationLevel !== 'none' && { educationLevel }),
        ...(fieldOfStudy && { fieldOfStudy }),
        ...(customRequirements.length > 0 && { customRequirements }),
      };
      
      formData.append('eligibilityCriteria', JSON.stringify(eligibilityCriteria));
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Scholarship Title *</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g., Women in Tech Scholarship"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g., women-in-tech-scholarship"
            required
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers, and hyphens allowed"
          />
          <p className="text-xs text-muted-foreground">
            Auto-generated from title. You can edit it if needed.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initialData?.description}
            placeholder="Describe the scholarship purpose and goals"
            required
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD) *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              defaultValue={initialData?.amount}
              placeholder="5000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAwards">Maximum Awards *</Label>
            <Input
              id="maxAwards"
              name="maxAwards"
              type="number"
              min="1"
              defaultValue={initialData?.maxAwards || 10}
              placeholder="10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Scholarship Type *</Label>
          <Select name="type" defaultValue={initialData?.type || ScholarshipType.GENERAL}>
            <SelectTrigger>
              <SelectValue placeholder="Select scholarship type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ScholarshipType.MERIT_BASED}>Merit Based</SelectItem>
              <SelectItem value={ScholarshipType.NEED_BASED}>Need Based</SelectItem>
              <SelectItem value={ScholarshipType.WOMEN_IN_TECH}>Women in Tech</SelectItem>
              <SelectItem value={ScholarshipType.GENERAL}>General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicationDeadline">Application Deadline *</Label>
          <Input
            id="applicationDeadline"
            name="applicationDeadline"
            type="date"
            defaultValue={initialData?.applicationDeadline?.split('T')[0]}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="donorName">Donor Name *</Label>
          <Input
            id="donorName"
            name="donorName"
            defaultValue={initialData?.donorName}
            placeholder="e.g., Tech Foundation Inc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="donorLogoUrl">Donor Logo URL (optional)</Label>
          <Input
            id="donorLogoUrl"
            name="donorLogoUrl"
            type="url"
            defaultValue={initialData?.donorLogoUrl}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Eligibility Criteria</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Define who can apply for this scholarship
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minGPA">Minimum GPA (optional)</Label>
              <Input
                id="minGPA"
                type="number"
                step="0.1"
                min="0"
                max="4.0"
                value={minGPA}
                onChange={(e) => setMinGPA(parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
              <p className="text-xs text-muted-foreground">Leave empty for no GPA requirement</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="educationLevel">Education Level (optional)</Label>
              <Select value={educationLevel} onValueChange={setEducationLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No requirement</SelectItem>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minAge">Minimum Age (optional)</Label>
              <Input
                id="minAge"
                type="number"
                min="0"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                placeholder="18"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAge">Maximum Age (optional)</Label>
              <Input
                id="maxAge"
                type="number"
                min="0"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                placeholder="35"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fieldOfStudy">Field of Study (optional)</Label>
            <Input
              id="fieldOfStudy"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="e.g., Computer Science, Engineering, Business"
            />
            <p className="text-xs text-muted-foreground">Leave empty for any field of study</p>
          </div>

          <div className="space-y-3">
            <Label>Required Documents</Label>
            <p className="text-sm text-muted-foreground">Select documents applicants must submit</p>
            <div className="grid grid-cols-2 gap-3">
              {documentOptions.map((doc) => (
                <div key={doc} className="flex items-center space-x-2">
                  <Checkbox
                    id={doc}
                    checked={requiredDocuments.includes(doc)}
                    onCheckedChange={() => toggleDocument(doc)}
                  />
                  <Label htmlFor={doc} className="text-sm font-normal cursor-pointer">
                    {doc}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalRequirements">Additional Requirements</Label>
            <Textarea
              id="additionalRequirements"
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              placeholder="Describe any additional eligibility requirements..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Custom Requirements</Label>
            <div className="flex gap-2">
              <Input
                value={customRequirement}
                onChange={(e) => setCustomRequirement(e.target.value)}
                placeholder="Add a custom requirement"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomRequirement())}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addCustomRequirement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {customRequirements.length > 0 && (
              <div className="space-y-2">
                {customRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="text-sm flex-1">{req}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustomRequirement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
