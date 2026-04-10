'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, CheckCircle, Video, FileText, HelpCircle, Play, Download, MessageSquare } from 'lucide-react';

const mockCourses = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript from scratch.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
    instructor: 'Sarah Johnson',
    rating: 4.8,
    duration: '8 weeks',
    curriculum: [
      { 
        id: 'lesson-1-1', 
        title: 'Introduction to HTML', 
        module: 'Module 1: HTML Basics', 
        duration: '30 mins', 
        type: 'video',
        content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. In this lesson, you\'ll learn the fundamentals of HTML structure, tags, and how browsers interpret markup.'
      },
      { 
        id: 'lesson-1-2', 
        title: 'HTML Structure & Tags', 
        module: 'Module 1: HTML Basics', 
        duration: '45 mins', 
        type: 'video',
        content: 'Learn about semantic HTML, the document structure, and commonly used tags like div, span, header, footer, and more.'
      },
      { 
        id: 'lesson-1-3', 
        title: 'Forms & Input Elements', 
        module: 'Module 1: HTML Basics', 
        duration: '40 mins', 
        type: 'video',
        content: 'Master HTML forms, input types, validation, and how to create user-friendly form interfaces.'
      },
      { 
        id: 'lesson-1-4', 
        title: 'HTML Best Practices', 
        module: 'Module 1: HTML Basics', 
        duration: '25 mins', 
        type: 'document',
        content: 'Document detailing best practices for writing clean, semantic, and accessible HTML code.'
      },
      { 
        id: 'lesson-1-5', 
        title: 'HTML Quiz', 
        module: 'Module 1: HTML Basics', 
        duration: '15 mins', 
        type: 'quiz',
        content: 'Test your knowledge of HTML fundamentals with this interactive quiz.'
      },
      { 
        id: 'lesson-2-1', 
        title: 'CSS Selectors', 
        module: 'Module 2: CSS Styling', 
        duration: '35 mins', 
        type: 'video',
        content: 'Learn about CSS selectors: element selectors, class selectors, ID selectors, attribute selectors, and combinators.'
      },
      { 
        id: 'lesson-2-2', 
        title: 'Styling Text & Colors', 
        module: 'Module 2: CSS Styling', 
        duration: '40 mins', 
        type: 'video',
        content: 'Master text properties, color formats (RGB, HEX, HSL), gradients, and typography best practices.'
      },
      { 
        id: 'lesson-2-3', 
        title: 'Box Model & Layout', 
        module: 'Module 2: CSS Styling', 
        duration: '50 mins', 
        type: 'video',
        content: 'Understand the CSS box model, margin, padding, borders, and positioning techniques.'
      },
      { 
        id: 'lesson-2-4', 
        title: 'Flexbox Basics', 
        module: 'Module 2: CSS Styling', 
        duration: '45 mins', 
        type: 'video',
        content: 'Learn Flexbox for creating flexible and responsive layouts with justify-content, align-items, and flex properties.'
      },
      { 
        id: 'lesson-2-5', 
        title: 'CSS Grid Introduction', 
        module: 'Module 2: CSS Styling', 
        duration: '40 mins', 
        type: 'video',
        content: 'Introduction to CSS Grid for creating 2D layouts with rows, columns, and grid areas.'
      },
      { 
        id: 'lesson-2-6', 
        title: 'CSS Quiz', 
        module: 'Module 2: CSS Styling', 
        duration: '20 mins', 
        type: 'quiz',
        content: 'Test your CSS knowledge with this comprehensive quiz.'
      },
    ],
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    description: 'Master advanced React concepts.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=400&fit=crop',
    instructor: 'Mike Chen',
    rating: 4.9,
    duration: '10 weeks',
    curriculum: [
      { 
        id: 'lesson-1-1', 
        title: 'Introduction to Advanced Hooks', 
        module: 'Module 1', 
        duration: '45 mins', 
        type: 'video',
        content: 'Explore advanced React hooks and their real-world applications.'
      },
      { 
        id: 'lesson-1-2', 
        title: 'useReducer & State Management', 
        module: 'Module 1', 
        duration: '50 mins', 
        type: 'video',
        content: 'Learn how useReducer can help manage complex state in React applications.'
      },
    ],
  },
  {
    id: '3',
    title: 'Data Science Essentials',
    description: 'Introduction to Python and data analysis.',
    image: 'https://images.unsplash.com/photo-1518186285671-4d71bcdd2085?w=800&h=400&fit=crop',
    instructor: 'Dr. Emily Rodriguez',
    rating: 4.7,
    duration: '12 weeks',
    curriculum: [
      { 
        id: 'lesson-1-1', 
        title: 'Python Basics', 
        module: 'Module 1', 
        duration: '45 mins', 
        type: 'video',
        content: 'Get started with Python programming fundamentals.'
      },
    ],
  },
];

function getCourse(id: string) {
  return mockCourses.find(c => c.id === id) || null;
}

export default function LearnPage({ params }: { params: { id: string } }) {
  const course = getCourse(params.id);
  const [currentLessonId, setCurrentLessonId] = useState(course?.curriculum?.[0]?.id || '');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!course) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Course Not Found</h1>
            <p className="text-muted-foreground mb-4">The course you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  const currentLesson = course.curriculum.find(l => l.id === currentLessonId);
  const lessonIndex = course.curriculum.findIndex(l => l.id === currentLessonId);
  const nextLesson = lessonIndex < course.curriculum.length - 1 ? course.curriculum[lessonIndex + 1] : null;
  const prevLesson = lessonIndex > 0 ? course.curriculum[lessonIndex - 1] : null;

  const toggleLessonComplete = () => {
    if (currentLessonId) {
      setCompletedLessons(prev => 
        prev.includes(currentLessonId) 
          ? prev.filter(id => id !== currentLessonId)
          : [...prev, currentLessonId]
      );
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'quiz':
        return <HelpCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const completionPercentage = Math.round((completedLessons.length / course.curriculum.length) * 100);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-muted border-r border-border overflow-hidden transition-all duration-300 flex flex-col`}>
          <div className="p-6 border-b border-border overflow-y-auto flex-1">
            <Link href={`/courses/${params.id}`} className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 text-sm">
              <ChevronLeft className="h-4 w-4" />
              Back to course
            </Link>

            <h2 className="font-semibold text-foreground mb-2 text-sm">Course Content</h2>
            <div className="text-xs text-muted-foreground mb-4">{completionPercentage}% complete</div>
            <div className="w-full bg-background rounded-full h-2 mb-6">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${completionPercentage}%` }} />
            </div>

            <div className="space-y-1">
              {course.curriculum.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLessonId(lesson.id)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                    currentLessonId === lesson.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-background'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      {completedLessons.includes(lesson.id) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        getIconForType(lesson.type)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{lesson.title}</p>
                      <p className="text-xs opacity-75">{lesson.duration}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-4 hover:bg-muted text-foreground lg:hidden"
          >
            <ChevronLeft className={`h-6 w-6 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>

          {currentLesson && (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Lesson Header */}
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-2">{currentLesson.module}</p>
                  <h1 className="text-3xl font-bold text-foreground mb-4">{currentLesson.title}</h1>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {getIconForType(currentLesson.type)}
                      <span className="capitalize">{currentLesson.type}</span>
                    </div>
                    <span>{currentLesson.duration}</span>
                  </div>
                </div>

                {/* Video Player or Content */}
                <Card className="mb-8 overflow-hidden bg-black">
                  {currentLesson.type === 'video' && (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <Play className="h-16 w-16 text-muted-foreground" />
                        <p className="text-muted-foreground">Video Player</p>
                        <p className="text-sm text-muted-foreground text-center">
                          In production, this would embed a video player (YouTube, Vimeo, or custom).
                        </p>
                      </div>
                    </div>
                  )}
                  {(currentLesson.type === 'document' || currentLesson.type === 'quiz') && (
                    <div className="aspect-video bg-muted flex items-center justify-center p-6">
                      <div className="text-center">
                        <p className="text-muted-foreground text-lg mb-2">Lesson Content</p>
                        <p className="text-muted-foreground">{currentLesson.content}</p>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Lesson Description */}
                <Card className="p-6 mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">About this lesson</h2>
                  <p className="text-muted-foreground leading-relaxed">{currentLesson.content}</p>
                </Card>

                {/* Resources */}
                <Card className="p-6 mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Resources</h2>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-foreground">
                      <Download className="h-5 w-5" />
                      <span>Download lesson notes</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-foreground">
                      <FileText className="h-5 w-5" />
                      <span>View source code</span>
                    </button>
                  </div>
                </Card>

                {/* Discussion */}
                <Card className="p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="h-5 w-5" />
                    <h2 className="text-xl font-semibold text-foreground">Discussion</h2>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">In production, this section would show student discussions and Q&A.</p>
                  <textarea
                    placeholder="Ask a question or share your thoughts..."
                    className="w-full p-3 rounded-lg bg-muted text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                  <Button className="mt-3">Post Comment</Button>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between mb-12">
                  {prevLesson ? (
                    <Button variant="outline" onClick={() => setCurrentLessonId(prevLesson.id)}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous lesson
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button
                    onClick={toggleLessonComplete}
                    variant={completedLessons.includes(currentLessonId) ? 'default' : 'outline'}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {completedLessons.includes(currentLessonId) ? 'Completed' : 'Mark as complete'}
                  </Button>
                  {nextLesson ? (
                    <Button onClick={() => setCurrentLessonId(nextLesson.id)}>
                      Next lesson
                      <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/dashboard">View Certificate</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
