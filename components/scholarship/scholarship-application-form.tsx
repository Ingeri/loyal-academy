'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, Upload, X, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { uploadDocument, submitScholarshipApplication } from '@/app/scholarships/actions';
import { DocumentType, DOCUMENT_TYPE_LABELS, ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_ADDITIONAL_DOCUMENTS, MIN_MOTIVATION_LENGTH } from '@/lib/constants/scholarship';

interface Scholarship {
  id: string;
  title: string;
  amount: number;
  type: string;
  applicationDeadline: Date;
  description: string;
}

interface AdditionalDocument {
  type: DocumentType;
  name: string;
  url: string;
}

interface ScholarshipApplicationFormProps {
  scholarships: Scholarship[];
  initialScholarshipId?: string;
}

export default function ScholarshipApplicationForm({ scholarships, initialScholarshipId }: ScholarshipApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [scholarshipId, setScholarshipId] = useState(initialScholarshipId || '');
  const [motivationLetter, setMotivationLetter] = useState('');
  const [financialNeedProof, setFinancialNeedProof] = useState<{ url: string; name: string } | null>(null);
  const [additionalDocuments, setAdditionalDocuments] = useState<AdditionalDocument[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | ''>('');

  const selectedScholarship = scholarships.find(s => s.id === scholarshipId);

  const handleFileUpload = async (file: File, isFinancialProof: boolean = false, docType?: DocumentType) => {
    setUploadingFile(true);
    setError(null);

    try {
      // Client-side validation
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
        setUploadingFile(false);
        return;
      }

      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
        setError(`Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(', ')}`);
        setUploadingFile(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadDocument(formData);

      if (result.success && result.url) {
        if (isFinancialProof) {
          setFinancialNeedProof({ url: result.url, name: result.fileName || file.name });
        } else if (docType) {
          setAdditionalDocuments([...additionalDocuments, {
            type: docType,
            name: result.fileName || file.name,
            url: result.url
          }]);
          setSelectedDocType(''); // Reset selection after upload
        }
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddDocument = (file: File) => {
    if (selectedDocType) {
      handleFileUpload(file, false, selectedDocType);
    } else {
      setError('Please select a document type first');
    }
  };

  const removeAdditionalDocument = (index: number) => {
    setAdditionalDocuments(additionalDocuments.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert additionalDocuments to plain objects for serialization
      const serializedDocuments = additionalDocuments.map(doc => ({
        type: doc.type as string,
        name: doc.name,
        url: doc.url,
      }));

      const result = await submitScholarshipApplication({
        scholarshipId,
        motivationLetter,
        financialNeedProof: financialNeedProof?.url,
        additionalDocuments: serializedDocuments as any,
      });

      if (result.success) {
        setSuccess(true);
      } else {
        if (result.errors && result.errors.length > 0) {
          const errorMessages = result.errors.map((err: any) => `${err.path}: ${err.message}`).join('\n');
          setError(`Validation errors:\n${errorMessages}`);
        } else {
          setError(result.error || 'Failed to submit application');
        }
      }
    } catch (err) {
      setError('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return !!scholarshipId;
      case 2:
        return motivationLetter.length >= MIN_MOTIVATION_LENGTH;
      case 3:
        if (selectedScholarship?.type === 'NEED_BASED') {
          return !!financialNeedProof;
        }
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceedToNext() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (success) {
    return (
      <Card className="p-8">
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your scholarship application has been submitted successfully. You can track its status in your dashboard.
          </p>
          <Button onClick={() => window.location.href = '/dashboard?tab=scholarships'}>
            Go to Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Scholarship Application Form</h2>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step}
              </div>
              {step < 5 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  step < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="w-16 text-center">Scholarship</span>
          <span className="w-16 text-center">Motivation</span>
          <span className="w-16 text-center">Financial</span>
          <span className="w-16 text-center">Documents</span>
          <span className="w-16 text-center">Review</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="text-sm text-destructive whitespace-pre-line">{error}</div>
        </div>
      )}

      {/* Step 1: Scholarship Selection */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="scholarshipId">Select Scholarship *</Label>
            <Select value={scholarshipId} onValueChange={setScholarshipId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a scholarship..." />
              </SelectTrigger>
              <SelectContent>
                {scholarships.map((scholarship) => (
                  <SelectItem key={scholarship.id} value={scholarship.id}>
                    {scholarship.title} - ${Number(scholarship.amount).toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedScholarship && (
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">{selectedScholarship.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{selectedScholarship.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Amount:</span> ${Number(selectedScholarship.amount).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {selectedScholarship.type.toLowerCase().replace('_', ' ')}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Deadline:</span> {new Date(selectedScholarship.applicationDeadline).toLocaleDateString()}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Step 2: Motivation Letter */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="motivationLetter">Motivation Letter *</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Explain why you deserve this scholarship and how it will help you achieve your educational goals.
            </p>
            <Textarea
              id="motivationLetter"
              value={motivationLetter}
              onChange={(e) => setMotivationLetter(e.target.value)}
              rows={10}
              placeholder="Write your motivation letter here..."
              className="mt-2"
            />
            <div className="flex justify-between mt-2 text-sm">
              <span className={motivationLetter.length < MIN_MOTIVATION_LENGTH ? 'text-destructive' : 'text-muted-foreground'}>
                {motivationLetter.length < MIN_MOTIVATION_LENGTH && `Minimum ${MIN_MOTIVATION_LENGTH} characters required. `}
                {motivationLetter.length} / {MIN_MOTIVATION_LENGTH}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Financial Need Proof */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="financialNeedProof">
              Financial Need Proof {selectedScholarship?.type === 'NEED_BASED' ? '*' : '(Optional)'}
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              {selectedScholarship?.type === 'NEED_BASED' 
                ? 'This scholarship requires proof of financial need. Please upload a document.'
                : 'Optional: Upload documentation of your financial situation.'}
            </p>
            
            {!financialNeedProof ? (
              <div className="mt-2">
                <Input
                  id="financialNeedProof"
                  type="file"
                  accept={ALLOWED_FILE_TYPES.join(',')}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, true);
                  }}
                  disabled={uploadingFile}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Allowed: PDF, JPG, PNG (Max {MAX_FILE_SIZE / 1024 / 1024}MB)
                </p>
              </div>
            ) : (
              <Card className="p-4 bg-muted/50 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{financialNeedProof.name}</p>
                      <p className="text-xs text-muted-foreground">{financialNeedProof.url}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFinancialNeedProof(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {selectedScholarship?.type === 'NEED_BASED' && !financialNeedProof && (
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  This is a need-based scholarship. You must provide proof of financial need to be eligible.
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Step 4: Additional Documents */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div>
            <Label>Additional Documents (Optional)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Upload supporting documents. Maximum {MAX_ADDITIONAL_DOCUMENTS} documents.
            </p>
            
            {additionalDocuments.length < MAX_ADDITIONAL_DOCUMENTS && (
              <Card className="p-4 bg-muted/50 mt-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="docType">Document Type</Label>
                    <Select value={selectedDocType} onValueChange={(value) => setSelectedDocType(value as DocumentType)}>
                      <SelectTrigger id="docType" className="mt-2">
                        <SelectValue placeholder="Select document type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DOCUMENT_TYPE_LABELS).map(([type, label]) => (
                          <SelectItem key={type} value={type}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="additionalFile">Upload File</Label>
                    <Input
                      id="additionalFile"
                      type="file"
                      accept={ALLOWED_FILE_TYPES.join(',')}
                      disabled={!selectedDocType || uploadingFile}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAddDocument(file);
                        // Reset file input
                        e.target.value = '';
                      }}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Allowed: PDF, JPG, PNG (Max {MAX_FILE_SIZE / 1024 / 1024}MB)
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {additionalDocuments.length >= MAX_ADDITIONAL_DOCUMENTS && (
              <p className="text-sm text-muted-foreground mt-2">
                Maximum number of documents reached ({MAX_ADDITIONAL_DOCUMENTS}).
              </p>
            )}

            {/* Document List */}
            {additionalDocuments.length > 0 && (
              <div className="space-y-3 mt-4">
                <Label>Uploaded Documents ({additionalDocuments.length}/{MAX_ADDITIONAL_DOCUMENTS})</Label>
                {additionalDocuments.map((doc, index) => (
                  <Card key={index} className="p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{DOCUMENT_TYPE_LABELS[doc.type]}</p>
                          <p className="text-xs text-muted-foreground">{doc.name}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAdditionalDocument(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 5: Review */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Review Your Application</h3>
            
            <Card className="p-4 bg-muted/50 mb-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Scholarship:</span>
                  <p className="text-sm text-muted-foreground">{selectedScholarship?.title}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Amount:</span>
                  <p className="text-sm text-muted-foreground">${selectedScholarship?.amount ? Number(selectedScholarship.amount).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Motivation Letter:</span>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{motivationLetter}</p>
                </div>
                {financialNeedProof && (
                  <div>
                    <span className="text-sm font-medium">Financial Need Proof:</span>
                    <p className="text-sm text-muted-foreground">{financialNeedProof.name}</p>
                  </div>
                )}
                {additionalDocuments.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Additional Documents:</span>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      {additionalDocuments.map((doc, index) => (
                        <li key={index}>• {DOCUMENT_TYPE_LABELS[doc.type]}: {doc.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Before submitting:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ensure all information is accurate</li>
                    <li>Double-check your motivation letter</li>
                    <li>Verify all required documents are uploaded</li>
                    <li>You can only apply once per scholarship</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1 || isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < 5 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceedToNext() || uploadingFile}
          >
            {uploadingFile ? 'Uploading...' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </Card>
  );
}
