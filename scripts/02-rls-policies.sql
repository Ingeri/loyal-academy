-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public can view instructor profiles" ON public.users FOR SELECT USING (role = 'instructor');

-- RLS Policies for courses
CREATE POLICY "Published courses are viewable by all" ON public.courses FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Instructors can view their own courses" ON public.courses FOR SELECT USING (auth.uid() = instructor_id);
CREATE POLICY "Instructors can create courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can update their own courses" ON public.courses FOR UPDATE USING (auth.uid() = instructor_id);

-- RLS Policies for course_content
CREATE POLICY "Published course content is viewable" ON public.course_content FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE courses.id = course_content.course_id AND courses.is_published = TRUE)
);

-- RLS Policies for enrollments
CREATE POLICY "Students can view their enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can enroll in courses" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Instructors can view enrollments in their courses" ON public.enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE courses.id = enrollments.course_id AND courses.instructor_id = auth.uid())
);

-- RLS Policies for progress
CREATE POLICY "Students can view their progress" ON public.progress FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.enrollments WHERE enrollments.id = progress.enrollment_id AND enrollments.student_id = auth.uid())
);
CREATE POLICY "Students can update their progress" ON public.progress FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.enrollments WHERE enrollments.id = progress.enrollment_id AND enrollments.student_id = auth.uid())
);

-- RLS Policies for certificates
CREATE POLICY "Students can view their certificates" ON public.certificates FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.enrollments WHERE enrollments.id = certificates.enrollment_id AND enrollments.student_id = auth.uid())
);

-- RLS Policies for payments
CREATE POLICY "Students can view their payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.enrollments WHERE enrollments.id = payments.enrollment_id AND enrollments.student_id = auth.uid())
);

-- RLS Policies for blog_posts
CREATE POLICY "Published posts are viewable by all" ON public.blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Authors can view their own posts" ON public.blog_posts FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Authors can create posts" ON public.blog_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update their own posts" ON public.blog_posts FOR UPDATE USING (auth.uid() = author_id);

-- RLS Policies for blog_comments
CREATE POLICY "Comments on published posts are viewable" ON public.blog_comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.blog_posts WHERE blog_posts.id = blog_comments.post_id AND blog_posts.is_published = TRUE)
);
CREATE POLICY "Users can create comments" ON public.blog_comments FOR INSERT WITH CHECK (auth.uid() = author_id);

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON public.courses(is_published);
CREATE INDEX IF NOT EXISTS idx_course_content_course_id ON public.course_content(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_enrollment_id ON public.progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_progress_content_id ON public.progress(content_id);
CREATE INDEX IF NOT EXISTS idx_certificates_enrollment_id ON public.certificates(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_payments_enrollment_id ON public.payments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id ON public.payments(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON public.blog_comments(post_id);
