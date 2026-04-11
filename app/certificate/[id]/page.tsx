'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, ArrowLeft } from 'lucide-react';

const mockCourses = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    instructor: 'Sarah Johnson',
    duration: '8 weeks',
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    instructor: 'Mike Chen',
    duration: '10 weeks',
  },
  {
    id: '3',
    title: 'Data Science Essentials',
    instructor: 'Dr. Emily Rodriguez',
    duration: '12 weeks',
  },
  {
    id: '4',
    title: 'UX/UI Design Bootcamp',
    instructor: 'Alex Kim',
    duration: '10 weeks',
  },
  {
    id: '5',
    title: 'Cloud Architecture with AWS',
    instructor: 'James Park',
    duration: '12 weeks',
  },
  {
    id: '6',
    title: 'Machine Learning Fundamentals',
    instructor: 'Prof. David Lee',
    duration: '14 weeks',
  },
];

function getCourse(id: string) {
  return mockCourses.find(c => c.id === id) || null;
}

function generateCertificateNumber() {
  return `LC-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export default function CertificatePage({ params }: { params: any }) {
  const id = params?.id || '';
  const course = getCourse(id);
  const certificateRef = useRef<HTMLDivElement>(null);
  const studentName = 'John Doe'; // In production, this would come from user auth
  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const certificateNumber = generateCertificateNumber();

  if (!course) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Certificate Not Found</h1>
            <p className="text-muted-foreground mb-4">The certificate you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate-${params.id}-${studentName.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  const handleShare = () => {
    const shareText = `I just completed "${course.title}" on Loyal Academy! Check out my certificate: ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Loyal Academy Certificate',
        text: shareText,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Certificate link copied to clipboard!');
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Certificate</h1>
          <p className="text-lg text-muted-foreground">
            Congratulations on completing {course.title}!
          </p>
        </div>

        {/* Certificate Display */}
        <div className="mb-8 flex justify-center">
          <div
            ref={certificateRef}
            className="w-full max-w-4xl bg-gradient-to-br from-amber-50 via-white to-amber-50 p-12 rounded-lg shadow-2xl border-4 border-amber-200"
            style={{
              aspectRatio: '1.4',
            }}
          >
            {/* Certificate Border Pattern */}
            <div className="absolute inset-0 border-8 border-amber-300 rounded-lg pointer-events-none" style={{ opacity: 0.3 }} />
            
            <div className="h-full flex flex-col items-center justify-center text-center relative z-10 py-8">
              {/* Certificate Header */}
              <div className="mb-8">
                <div className="text-5xl font-bold text-amber-900 mb-2">Certificate of Completion</div>
                <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto" />
              </div>

              {/* Main Content */}
              <div className="mb-8">
                <p className="text-lg text-amber-900 mb-4">This certifies that</p>
                <h2 className="text-4xl font-bold text-amber-950 mb-6">{studentName}</h2>
                <p className="text-base text-amber-900">has successfully completed the course</p>
              </div>

              {/* Course Title */}
              <div className="mb-12">
                <h3 className="text-3xl font-bold text-amber-950 italic mb-2">&quot;{course.title}&quot;</h3>
                <p className="text-sm text-amber-800">Instructed by {course.instructor}</p>
              </div>

              {/* Certificate Details */}
              <div className="grid grid-cols-3 gap-8 mb-8 w-full max-w-2xl">
                <div>
                  <p className="text-xs text-amber-700 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-sm font-semibold text-amber-950">{completionDate}</p>
                </div>
                <div>
                  <p className="text-xs text-amber-700 uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-sm font-semibold text-amber-950">{course.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-amber-700 uppercase tracking-widest mb-1">Certificate ID</p>
                  <p className="text-sm font-semibold text-amber-950">{certificateNumber}</p>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-12 pt-8 border-t-2 border-amber-400 w-full max-w-md">
                <p className="text-xs text-amber-700 mb-8">_____________________________</p>
                <p className="text-sm font-semibold text-amber-950">Loyal Academy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button size="lg" onClick={handleDownloadPDF} className="gap-2">
            <Download className="h-5 w-5" />
            Download as PDF
          </Button>
          <Button size="lg" variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="h-5 w-5" />
            Share Certificate
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">View All Certificates</Link>
          </Button>
        </div>

        {/* Certificate Details Card */}
        <Card className="p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-4">Certificate Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Course Title</p>
              <p className="text-lg font-semibold text-foreground">{course.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Instructor</p>
              <p className="text-lg font-semibold text-foreground">{course.instructor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Date</p>
              <p className="text-lg font-semibold text-foreground">{completionDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Certificate Number</p>
              <p className="text-lg font-semibold text-foreground font-mono">{certificateNumber}</p>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Certificate Link</p>
              <p className="text-sm text-primary break-all">{typeof window !== 'undefined' ? window.location.href : 'Your certificate URL'}</p>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </main>
  );
}
