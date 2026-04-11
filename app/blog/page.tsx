'use client';

import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const mockBlogPosts = [
  {
    id: '1',
    title: '10 Web Development Tips for Beginners',
    slug: '10-web-development-tips-beginners',
    excerpt: 'Learn the essential web development practices that will help you write cleaner, more efficient code and build better websites.',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=800&h=400&fit=crop',
    category: 'Web Development',
    author: 'Sarah Johnson',
    publishedAt: '2026-04-08',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'The Future of User Interface Design',
    slug: 'future-of-ui-design',
    excerpt: 'Explore emerging trends in UI design including AI-assisted design, voice interfaces, and immersive experiences.',
    image: 'https://images.pexels.com/photos/3150150/pexels-photo-3150150.jpeg?w=800&h=400&fit=crop',
    category: 'Design',
    author: 'Alex Kim',
    publishedAt: '2026-04-05',
    readTime: '7 min read',
  },
  {
    id: '3',
    title: 'Mastering React Hooks: useEffect Deep Dive',
    slug: 'mastering-react-hooks-useEffect',
    excerpt: 'Understand the intricacies of useEffect in React and learn how to avoid common pitfalls and optimize your components.',
    image: 'https://images.pexels.com/photos/3583447/pexels-photo-3583447.jpeg?w=800&h=400&fit=crop',
    category: 'Web Development',
    author: 'Mike Chen',
    publishedAt: '2026-04-01',
    readTime: '8 min read',
  },
  {
    id: '4',
    title: 'Getting Started with AWS: A Practical Guide',
    slug: 'getting-started-aws',
    excerpt: 'Learn the fundamentals of AWS and how to deploy your first application on the cloud with step-by-step instructions.',
    image: 'https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?w=800&h=400&fit=crop',
    category: 'Cloud',
    author: 'James Park',
    publishedAt: '2026-03-28',
    readTime: '10 min read',
  },
  {
    id: '5',
    title: 'Data Science in Production: Best Practices',
    slug: 'data-science-production',
    excerpt: 'Discover the best practices for deploying and maintaining machine learning models in production environments.',
    image: 'https://images.pexels.com/photos/3182751/pexels-photo-3182751.jpeg?w=800&h=400&fit=crop',
    category: 'Data Science',
    author: 'Dr. Emily Rodriguez',
    publishedAt: '2026-03-25',
    readTime: '9 min read',
  },
  {
    id: '6',
    title: 'CSS Grid vs Flexbox: When to Use Each',
    slug: 'css-grid-vs-flexbox',
    excerpt: 'Understand the differences between CSS Grid and Flexbox, and learn when to use each layout method for optimal results.',
    image: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?w=800&h=400&fit=crop',
    category: 'Web Development',
    author: 'Sarah Johnson',
    publishedAt: '2026-03-20',
    readTime: '6 min read',
  },
  {
    id: '7',
    title: 'UX Research Methods That Work',
    slug: 'ux-research-methods',
    excerpt: 'Explore various user research methodologies and learn how to gather insights that inform better design decisions.',
    image: 'https://images.pexels.com/photos/3583447/pexels-photo-3583447.jpeg?w=800&h=400&fit=crop',
    category: 'Design',
    author: 'Alex Kim',
    publishedAt: '2026-03-15',
    readTime: '7 min read',
  },
  {
    id: '8',
    title: 'Machine Learning Model Evaluation Metrics',
    slug: 'ml-evaluation-metrics',
    excerpt: 'Learn how to properly evaluate machine learning models using accuracy, precision, recall, and F1-score.',
    image: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?w=800&h=400&fit=crop',
    category: 'Data Science',
    author: 'Prof. David Lee',
    publishedAt: '2026-03-10',
    readTime: '8 min read',
  },
];

export default function BlogPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const categories = ['all', ...Array.from(new Set(mockBlogPosts.map(p => p.category)))];
  const filteredPosts = selectedCategory === 'all' 
    ? mockBlogPosts 
    : mockBlogPosts.filter(p => p.category === selectedCategory);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-primary/10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-foreground mb-4">Loyal Academy Blog</h1>
          <p className="text-lg text-muted-foreground">Latest articles, tips, and insights from our community</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Category Filter */}
          <div className="flex gap-2 mb-12 overflow-x-auto pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {cat === 'all' ? 'All Posts' : cat}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {filteredPosts.length > 0 && (
            <Link href={`/blog/${filteredPosts[0].slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer mb-12 md:grid md:grid-cols-2">
                <img
                  src={filteredPosts[0].image}
                  alt={filteredPosts[0].title}
                  className="h-64 w-full object-cover md:h-auto"
                />
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {filteredPosts[0].category}
                    </span>
                    <span className="text-xs text-muted-foreground">{filteredPosts[0].readTime}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-6">{filteredPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{filteredPosts[0].author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(filteredPosts[0].publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary ml-auto" />
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Blog Posts Grid */}
          {filteredPosts.length > 1 ? (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.slice(1).map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No articles found in this category.</p>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
