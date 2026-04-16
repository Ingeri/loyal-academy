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
    image: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?w=800&h=400&fit=crop',
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
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?w=800&h=400&fit=crop',
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
  'data-science-production': {
    title: 'Data Science in Production: Best Practices',
    excerpt: 'Discover the best practices for deploying and maintaining machine learning models in production environments.',
    image: 'https://images.pexels.com/photos/3182751/pexels-photo-3182751.jpeg?w=1200&h=600&fit=crop',
    category: 'Data Science',
    author: 'Dr. Emily Rodriguez',
    publishedAt: '2026-03-25',
    readTime: '9 min read',
    content: `
      <h2>Introduction to Production ML</h2>
      <p>Building a machine learning model is only half the battle. Deploying it to production and maintaining its performance is equally important. Production ML requires careful consideration of data quality, model versioning, monitoring, and scalability.</p>

      <h2>Data Quality and Validation</h2>
      <p>Ensure your training data is representative and clean. Implement data validation pipelines that check for missing values, outliers, and distribution shifts. Monitor incoming data in production to catch issues early.</p>

      <h2>Model Versioning and Reproducibility</h2>
      <p>Track different versions of your models along with their hyperparameters and training data. Use tools like MLflow or Weights &amp; Biases to maintain reproducibility and facilitate rollbacks when needed.</p>

      <h2>Continuous Monitoring</h2>
      <p>Monitor model performance in production using metrics like prediction latency, accuracy degradation, and data drift. Set up alerts to detect when performance drops below acceptable thresholds.</p>

      <h2>A/B Testing and Gradual Rollouts</h2>
      <p>Never deploy a new model to 100% of traffic immediately. Use A/B testing to compare the new model with the baseline, and gradually increase traffic to the new version.</p>

      <h2>Handling Data Drift</h2>
      <p>Data drift occurs when the distribution of incoming data differs from the training data. Implement techniques to detect drift and retrain your models periodically with fresh data.</p>

      <h2>Scaling for Production</h2>
      <p>Use containerization (Docker) and orchestration platforms (Kubernetes) to scale your models. Consider using serverless options like AWS Lambda or Google Cloud Functions for variable workloads.</p>

      <h2>API Design and Documentation</h2>
      <p>Create clear APIs for your models with proper documentation. Include input/output specifications, example requests, and error handling. Use tools like FastAPI for rapid development.</p>

      <h2>Conclusion</h2>
      <p>Production ML requires a systematic approach to ensure reliability, scalability, and maintainability. Focus on monitoring, testing, and continuous improvement to keep your models performing well.</p>
    `,
  },
  'css-grid-vs-flexbox': {
    title: 'CSS Grid vs Flexbox: When to Use Each',
    excerpt: 'Understand the differences between CSS Grid and Flexbox, and learn when to use each layout method for optimal results.',
    image: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?w=1200&h=600&fit=crop',
    category: 'Web Development',
    author: 'Sarah Johnson',
    publishedAt: '2026-03-20',
    readTime: '6 min read',
    content: `
      <h2>Understanding Flexbox</h2>
      <p>Flexbox is a one-dimensional layout system designed for distributing items along a single axis—either row or column. It&apos;s perfect for navigation bars, toolbars, form elements, and any linear layouts.</p>

      <h2>Understanding CSS Grid</h2>
      <p>CSS Grid is a two-dimensional layout system that allows you to create complex layouts with rows and columns simultaneously. It&apos;s ideal for page layouts, dashboard components, and any design requiring alignment in both directions.</p>

      <h2>Flexbox Use Cases</h2>
      <p>Use Flexbox for: navigation menus, centering content, distributing space evenly, aligning items in a row or column, and creating responsive components that need fluid layouts.</p>

      <h2>CSS Grid Use Cases</h2>
      <p>Use CSS Grid for: page-level layouts, creating gallery-like designs, card layouts, sidebar + main content combinations, and any design requiring precise control over both rows and columns.</p>

      <h2>Combining Both Technologies</h2>
      <p>In modern CSS, Flexbox and Grid work together beautifully. Use Grid for overall page structure and Flexbox for components within those grid areas. This combination gives you the best of both worlds.</p>

      <h2>Browser Support</h2>
      <p>Both Flexbox and CSS Grid have excellent browser support in modern browsers. Flexbox has been stable for several years, while CSS Grid reached widespread adoption more recently but is now equally well-supported.</p>

      <h2>Performance Considerations</h2>
      <p>Both technologies have similar performance characteristics and are equally performant. Choose based on your layout needs rather than performance concerns.</p>

      <h2>Conclusion</h2>
      <p>The key is to understand the strengths of each system. Flexbox excels at one-dimensional layouts, while Grid handles two-dimensional designs. Use the right tool for the job and don&apos;t hesitate to combine them for optimal results.</p>
    `,
  },
  'ux-research-methods': {
    title: 'UX Research Methods That Work',
    excerpt: 'Explore various user research methodologies and learn how to gather insights that inform better design decisions.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=800&h=400&fit=crop',
    category: 'Design',
    author: 'Alex Kim',
    publishedAt: '2026-03-15',
    readTime: '7 min read',
    content: `
      <h2>Why User Research Matters</h2>
      <p>User research is the foundation of good design. It helps you understand your users&apos; needs, pain points, and behaviors. Without research, you&apos;re designing based on assumptions rather than facts.</p>

      <h2>User Interviews</h2>
      <p>Conduct one-on-one interviews with your users to understand their experiences, motivations, and challenges. Ask open-ended questions and listen actively. Interviews provide deep, qualitative insights that other methods might miss.</p>

      <h2>Surveys and Questionnaires</h2>
      <p>Surveys allow you to gather data from a larger sample size. Use a mix of open-ended and multiple-choice questions. Surveys are great for validating hypotheses and gathering quantitative data.</p>

      <h2>Usability Testing</h2>
      <p>Have real users interact with your prototype or product while you observe. Ask them to complete specific tasks and note where they struggle. Usability testing reveals real usage patterns versus theoretical ones.</p>

      <h2>A/B Testing</h2>
      <p>Test two versions of your design with different user groups. Measure which version performs better based on your metrics. A/B testing provides empirical evidence of what works best.</p>

      <h2>Analytics and User Behavior Data</h2>
      <p>Analyze how users actually interact with your product using analytics tools. Track click patterns, scroll behavior, and conversion funnels. Data-driven insights complement qualitative research.</p>

      <h2>Focus Groups</h2>
      <p>Bring together a small group of users for discussion. Focus groups are excellent for exploring attitudes, beliefs, and reactions to design concepts. The group dynamic can generate valuable insights.</p>

      <h2>Creating Actionable Insights</h2>
      <p>The key to successful research is turning findings into actionable insights. Synthesize your data, identify patterns, create personas, and prioritize changes based on impact and feasibility.</p>

      <h2>Conclusion</h2>
      <p>Great design comes from understanding your users. Combine multiple research methods to get a holistic view of your user base. Invest in research early and often to create products that truly resonate with your audience.</p>
    `,
  },
  'ml-evaluation-metrics': {
    title: 'Machine Learning Model Evaluation Metrics',
    excerpt: 'Learn how to properly evaluate machine learning models using accuracy, precision, recall, and F1-score.',
    image: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?w=1200&h=600&fit=crop',
    category: 'Data Science',
    author: 'Prof. David Lee',
    publishedAt: '2026-03-10',
    readTime: '8 min read',
    content: `
      <h2>The Importance of Evaluation Metrics</h2>
      <p>Choosing the right evaluation metric is crucial for understanding your model&apos;s performance. Different metrics suit different problems, and selecting the wrong one can lead to poor decisions.</p>

      <h2>Accuracy</h2>
      <p>Accuracy measures the percentage of correct predictions. While intuitive, accuracy can be misleading when dealing with imbalanced datasets where one class dominates the data.</p>

      <h2>Precision and Recall</h2>
      <p>Precision answers &quot;Of all the positive predictions, how many were actually correct?&quot; Recall answers &quot;Of all the actual positives, how many did we identify?&quot; Different applications prioritize different metrics.</p>

      <h2>The F1-Score</h2>
      <p>The F1-score is the harmonic mean of precision and recall. It provides a single metric that balances both concerns, making it useful when you want to optimize for both precision and recall equally.</p>

      <h2>Confusion Matrix</h2>
      <p>A confusion matrix provides a detailed breakdown of true positives, true negatives, false positives, and false negatives. It&apos;s the foundation for deriving precision, recall, and other metrics.</p>

      <h2>ROC Curve and AUC</h2>
      <p>The ROC curve plots true positive rate against false positive rate at different classification thresholds. The Area Under the Curve (AUC) summarizes overall performance across all thresholds.</p>

      <h2>Regression Metrics</h2>
      <p>For regression problems, use Mean Absolute Error (MAE), Mean Squared Error (MSE), or Root Mean Squared Error (RMSE). Choose based on how much you want to penalize large errors.</p>

      <h2>Cross-Validation</h2>
      <p>Always use cross-validation to evaluate your model on multiple data splits. This gives you a more robust estimate of performance than a single train-test split.</p>

      <h2>Conclusion</h2>
      <p>Understanding evaluation metrics is essential for building good ML models. Choose metrics that align with your business goals, and always validate on unseen data.</p>
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
