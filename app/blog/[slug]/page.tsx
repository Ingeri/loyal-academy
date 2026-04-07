import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft } from 'lucide-react';

async function getBlogPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*, author:users(full_name, avatar_url)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  return data;
}

async function getRelatedPosts(category: string, currentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image, published_at')
    .eq('is_published', true)
    .eq('category', category)
    .neq('id', currentId)
    .limit(3);

  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  return {
    title: post ? `${post.title} - Loyal Academy` : 'Blog - Loyal Academy',
    description: post?.excerpt || 'Read this blog post on Loyal Academy',
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = post.category ? await getRelatedPosts(post.category, post.id) : [];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <article className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  {post.category}
                </span>
              )}
              {post.published_at && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.published_at).toLocaleDateString()}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                {post.author.avatar_url && (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.full_name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author.full_name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-12"
            />
          )}

          {/* Content */}
          <div className="prose prose-sm sm:prose max-w-none mb-12">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12 pt-8 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-3">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="pt-12 border-t border-border">
              <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost: any) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      {relatedPost.featured_image && (
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          className="h-40 w-full object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

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
