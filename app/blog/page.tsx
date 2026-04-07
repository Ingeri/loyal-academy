import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';

export const metadata = {
  title: 'Blog - Loyal Academy',
  description: 'Read the latest articles and insights from Loyal Academy',
};

async function getBlogPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image, category, published_at, author_id')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(12);

  return data || [];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

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

      {/* Blog Posts */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {posts.length > 0 ? (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {post.category && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            {post.category}
                          </span>
                        )}
                        {post.published_at && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No blog posts yet. Check back soon!</p>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
