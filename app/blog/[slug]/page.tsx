'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const mockBlogPosts: { [key: string]: any } = {
  '10-web-development-tips-beginners': {
    title: '10 Web Development Tips for Beginners',
    excerpt: 'Learn the essential web development practices that will help you write cleaner, more efficient code and build better websites.',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=1200&h=600&fit=crop',
    category: 'Web Development',
    author: 'Sarah Johnson',
    publishedAt: '2026-04-08',
    readTime: '5 min read',
    content: `
      <h2>1. Start with HTML Fundamentals</h2>
      <p>Understanding HTML semantics is crucial. Use proper semantic tags like &lt;header&gt;, &lt;nav&gt;, &lt;main&gt;, and &lt;footer&gt; instead of relying solely on divs. This improves accessibility and SEO.</p>

      <h2>2. Master CSS Grid and Flexbox</h2>
      <p>Modern layouts are built with Flexbox and CSS Grid. Flexbox is perfect for one-dimensional layouts, while Grid excels at two-dimensional designs. Practice both to become versatile.</p>

      <h2>3. Learn JavaScript Fundamentals</h2>
      <p>Before jumping to frameworks, master vanilla JavaScript: ES6 syntax, async/await, promises, and DOM manipulation. This foundation makes learning React, Vue, or Angular much easier.</p>

      <h2>4. Use Version Control (Git)</h2>
      <p>Start using Git from day one. Understand commits, branches, and pull requests. This is essential for any professional development work.</p>

      <h2>5. Practice Responsive Design</h2>
      <p>Always design mobile-first. Use media queries, flexible grids, and viewport settings. Test your websites on multiple devices and screen sizes.</p>

      <h2>6. Write Clean Code</h2>
      <p>Use consistent naming conventions, proper indentation, and meaningful comments. Your future self (and teammates) will thank you.</p>

      <h2>7. Test Your Code</h2>
      <p>Learn about unit testing, integration testing, and end-to-end testing. Tools like Jest and React Testing Library are essential for professional development.</p>

      <h2>8. Understand HTTP and APIs</h2>
      <p>Know how HTTP works, REST principles, and how to fetch data from APIs. This knowledge is fundamental for modern web development.</p>

      <h2>9. Use Developer Tools</h2>
      <p>Master your browser's developer tools. Learn to debug, inspect elements, monitor network requests, and analyze performance.</p>

      <h2>10. Keep Learning</h2>
      <p>Technology evolves quickly. Stay updated with new frameworks, tools, and best practices. Follow blogs, watch tutorials, and participate in communities.</p>
    `,
  },
  'future-of-ui-design': {
    title: 'The Future of User Interface Design',
    excerpt: 'Explore emerging trends in UI design including AI-assisted design, voice interfaces, and immersive experiences.',
    image: 'https://images.pexels.com/photos/3150150/pexels-photo-3150150.jpeg?w=1200&h=600&fit=crop',
    category: 'Design',
    author: 'Alex Kim',
    publishedAt: '2026-04-05',
    readTime: '7 min read',
    content: `
      <h2>AI-Assisted Design</h2>
      <p>Artificial intelligence is revolutionizing design workflows. Tools powered by AI can generate layouts, color schemes, and even entire UI components based on descriptions.</p>

      <h2>Voice Interfaces</h2>
      <p>As smart speakers and voice assistants become mainstream, designing for voice interactions is increasingly important. UI design must adapt to handle both visual and voice-based interactions.</p>

      <h2>Dark Mode Everywhere</h2>
      <p>Dark mode is no longer a novelty—it's becoming standard. Designers must ensure their interfaces work beautifully in both light and dark modes.</p>

      <h2>Personalization at Scale</h2>
      <p>Users expect personalized experiences. Modern UI design must incorporate dynamic layouts and content that adapt to individual user preferences and behaviors.</p>

      <h2>Accessibility First</h2>
      <p>Accessible design is no longer optional. WCAG guidelines are becoming stricter, and users expect interfaces that work for everyone, regardless of abilities.</p>

      <h2>Immersive Experiences</h2>
      <p>VR and AR technologies are opening new possibilities for UI design. Designers must understand how to create interfaces in three-dimensional spaces.</p>

      <h2>Micro-interactions</h2>
      <p>Small, delightful animations and interactions are becoming expected. These micro-interactions improve user engagement and make interfaces feel more responsive.</p>

      <h2>Conclusion</h2>
      <p>The future of UI design is exciting and ever-evolving. By staying updated with these trends and continuously learning, designers can create interfaces that are not just beautiful, but also functional and inclusive.</p>
    `,
  },
  'mastering-react-hooks-useEffect': {
    title: 'Mastering React Hooks: useEffect Deep Dive',
    excerpt: 'Understand the intricacies of useEffect in React and learn how to avoid common pitfalls and optimize your components.',
    image: 'https://images.pexels.com/photos/3583447/pexels-photo-3583447.jpeg?w=1200&h=600&fit=crop',
    category: 'Web Development',
    author: 'Mike Chen',
    publishedAt: '2026-04-01',
    readTime: '8 min read',
    content: `
      <h2>Understanding useEffect</h2>
      <p>useEffect is a Hook that lets you perform side effects in functional components. Side effects are actions like data fetching, subscriptions, or manually changing the DOM.</p>

      <h2>The Dependency Array</h2>
      <p>The dependency array is crucial for controlling when effects run. No dependency array means the effect runs every render. An empty array means it runs once after mount. An array with values means it runs when those values change.</p>

      <h2>Cleanup Functions</h2>
      <p>useEffect can return a cleanup function. This function runs when the component unmounts or before the effect runs again. Use it to cancel subscriptions or clear timers.</p>

      <h2>Common Pitfalls</h2>
      <p>Forgetting dependencies in the dependency array is a common mistake that leads to stale closures. Always include all values from component scope that change over time.</p>

      <h2>Performance Optimization</h2>
      <p>Only update state in effects when necessary. Consider using useMemo or useCallback to optimize dependencies and prevent unnecessary effect runs.</p>

      <h2>Best Practices</h2>
      <p>Keep effects focused on a single concern. Use multiple effects if needed. Avoid complex logic inside effects; extract it to separate functions.</p>

      <h2>Real-world Example</h2>
      <p>A practical example might be fetching data from an API when the component mounts, with cleanup to cancel requests if the component unmounts before the request completes.</p>

      <h2>Conclusion</h2>
      <p>Mastering useEffect takes practice, but it's essential for writing effective React applications. Understanding dependencies and cleanup functions will make you a better React developer.</p>
    `,
  },
  'getting-started-aws': {
    title: 'Getting Started with AWS: A Practical Guide',
    excerpt: 'Learn the fundamentals of AWS and how to deploy your first application on the cloud with step-by-step instructions.',
    image: 'https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?w=1200&h=600&fit=crop',
    category: 'Cloud',
    author: 'James Park',
    publishedAt: '2026-03-28',
    readTime: '10 min read',
    content: `
      <h2>What is AWS?</h2>
      <p>Amazon Web Services is a comprehensive cloud platform offering over 200 services. It provides computing power, database storage, content delivery, and many other functionalities.</p>

      <h2>Setting Up Your AWS Account</h2>
      <p>Start by creating an AWS account and setting up your root account. Enable multi-factor authentication for security. Then create an IAM user for day-to-day operations.</p>

      <h2>Understanding Key Services</h2>
      <p>EC2 provides virtual servers. S3 offers object storage. RDS provides managed databases. Lambda enables serverless computing. Start with these core services.</p>

      <h2>Your First EC2 Instance</h2>
      <p>Launch an EC2 instance, connect via SSH, and deploy a simple application. This hands-on experience is invaluable for understanding how AWS works.</p>

      <h2>Storage with S3</h2>
      <p>S3 is perfect for storing files, hosting static websites, or backing up data. Learn about buckets, objects, and access control.</p>

      <h2>Databases with RDS</h2>
      <p>AWS's Relational Database Service simplifies database administration. Choose between MySQL, PostgreSQL, Oracle, or SQL Server.</p>

      <h2>Scalability and Load Balancing</h2>
      <p>Use Auto Scaling and Elastic Load Balancers to handle variable loads. Your application can automatically scale up or down based on demand.</p>

      <h2>Cost Management</h2>
      <p>AWS can be expensive if not managed carefully. Monitor your usage, set up billing alerts, and use cost calculator tools.</p>

      <h2>Security Best Practices</h2>
      <p>Always follow the principle of least privilege. Use VPCs for network isolation, encrypt data in transit and at rest, and regularly audit permissions.</p>

      <h2>Next Steps</h2>
      <p>Explore AWS Lambda for serverless computing, use CloudFront for content delivery, and implement monitoring with CloudWatch.</p>
    `,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const slug = params?.slug as string || '';
  const post = mockBlogPosts[slug];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
            <p className="text-muted-foreground mb-4">The blog post you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Image */}
      <div className="relative h-96 w-full overflow-hidden bg-muted">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <article className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <div className="mb-4">
              <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div>{post.readTime}</div>
            </div>
          </div>

          {/* Meta Info Card */}
          <Card className="p-6 mb-8 bg-muted/50">
            <p className="text-foreground">{post.excerpt}</p>
          </Card>

          {/* Content */}
          <div className="space-y-6 mb-8">
            {post.content
              .split('<h2>')
              .filter((section: string) => section.trim())
              .map((section: string, idx: number) => {
                const [title, ...contentParts] = section.split('</h2>');
                const content = contentParts.join('</h2>');
                return (
                  <div key={idx}>
                    <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">{title.trim()}</h2>
                    {content
                      .split('<p>')
                      .filter((p: string) => p.trim())
                      .map((paragraph: string, pIdx: number) => (
                        <p key={pIdx} className="text-muted-foreground leading-relaxed mb-4">
                          {paragraph.replace('</p>', '').trim()}
                        </p>
                      ))}
                  </div>
                );
              })}
          </div>

          {/* Share and Navigation */}
          <div className="border-t border-border pt-8 flex items-center justify-between">
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <Button asChild>
              <Link href="/blog">Read More Articles</Link>
            </Button>
          </div>

          {/* CTA */}
          <div className="mt-12 pt-12 border-t border-border">
            <Card className="p-8 bg-primary/10">
              <h3 className="text-xl font-bold text-foreground mb-2">Ready to learn?</h3>
              <p className="text-muted-foreground mb-6">
                Check out our comprehensive courses to expand your knowledge and skills.
              </p>
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </Card>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
