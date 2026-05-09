'use client';

import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Calendar, User, ArrowRight, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBlogs } from './actions';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getBlogs();
      setBlogs(data.blogs);
      setCategories(data.categories);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredPosts = selectedCategoryId === 'all'
    ? blogs
    : blogs.filter(p => p.blogCategoryId === selectedCategoryId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-primary/5 px-4 py-12 sm:px-6 lg:px-8 border-b border-primary/10">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-extrabold text-foreground mb-4 tracking-tight">Loyal Academy Insights</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced strategies in Digital Marketing, Entrepreneurship, and Leadership.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          
          {/* Category Filter */}
          <div className="flex gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategoryId === 'all' 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategoryId === cat.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {filteredPosts.length > 0 && selectedCategoryId === 'all' && (
            <Link href={`/blog/${filteredPosts[0].slug}`}>
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-primary/10 mb-12 md:grid md:grid-cols-2 ring-1 ring-primary/5">
                <div className="overflow-hidden relative">
                    <img
                    src={filteredPosts[0].thumbnail || '/placeholder-blog.jpg'}
                    alt={filteredPosts[0].title}
                    className="h-72 w-full object-cover md:h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Featured
                    </div>
                </div>
                <div className="p-8 flex flex-col justify-center bg-card">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                      {filteredPosts[0].blogCategory?.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {filteredPosts[0].avgRating.toFixed(1)}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                    {filteredPosts[0].description}
                  </p>
                  <div className="flex items-center gap-6 mt-auto pt-6 border-t border-muted">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-primary" />
                      <span>{filteredPosts[0].authorName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(filteredPosts[0].createdAt).toLocaleDateString()}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary ml-auto group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Grid for remaining posts */}
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {(selectedCategoryId === 'all' ? filteredPosts.slice(1) : filteredPosts).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border-primary/5 ring-1 ring-primary/5">
                  <div className="relative overflow-hidden">
                    <img
                        src={post.thumbnail || '/placeholder-blog.jpg'}
                        alt={post.title}
                        className="h-52 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 right-0 bg-background/80 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-tighter border-tl border-primary/10">
                        {post.readTime} min read
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 bg-card">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary mb-2">
                        {post.blogCategory?.name}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed flex-1">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-muted">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                            {post.authorName.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{post.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{post.avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <Card className="p-20 text-center border-dashed border-2 border-primary/10 bg-primary/5">
              <p className="text-xl font-semibold text-muted-foreground">No articles found in this category.</p>
              <button 
                onClick={() => setSelectedCategoryId('all')}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Show all posts
              </button>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}