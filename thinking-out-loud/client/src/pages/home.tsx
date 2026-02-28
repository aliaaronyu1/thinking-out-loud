import { usePosts } from "@/hooks/use-posts";
import { Link } from "wouter";
import { format } from "date-fns";
import { FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home({ filter = "all" }: { filter?: "all" | "drafts" }) {
  const { data: posts, isLoading, error } = usePosts();

  const filteredPosts = posts?.filter(post => {
    if (filter === "drafts") return post.status === "draft";
    return true; // "all" shows both drafts and published
  })?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-12 animate-pulse">
        <div className="h-10 bg-muted/50 rounded-lg w-1/3 mb-12"></div>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-border/40 space-y-4">
              <div className="h-6 bg-muted/50 rounded-md w-2/3"></div>
              <div className="h-4 bg-muted/50 rounded-md w-1/4"></div>
              <div className="h-20 bg-muted/30 rounded-md w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-12">
        <div className="p-6 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <h2 className="font-semibold text-lg">Failed to load posts</h2>
          <p className="opacity-80">There was an error communicating with the server.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 lg:py-20 lg:px-12">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground tracking-tight">
          {filter === "drafts" ? "Drafts" : "Library"}
        </h1>
        <p className="mt-3 text-muted-foreground text-lg font-serif italic opacity-80">
          {filter === "drafts" 
            ? "Unfinished thoughts and works in progress." 
            : "A collection of thoughts, notes, and explorations."}
        </p>
      </header>

      {filteredPosts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-3xl bg-muted/20">
          <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-serif font-medium text-foreground mb-2">It's quiet in here</h3>
          <p className="text-muted-foreground max-w-sm">
            {filter === "drafts" 
              ? "You don't have any drafts. Start writing and save something for later."
              : "Start documenting your thoughts. Your future self will thank you."}
          </p>
          <Link 
            href="/new" 
            className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          >
            Start writing
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts?.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="block group">
              <article className="p-6 md:p-8 rounded-3xl bg-card border border-border/50 shadow-sm shadow-black/5 hover:shadow-md hover:border-border transition-all duration-300">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="text-xl md:text-2xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.status === "draft" && (
                    <Badge variant="secondary" className="font-normal bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 shadow-none">
                      Draft
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground font-serif text-lg leading-relaxed line-clamp-3 mb-6 opacity-80">
                  {post.content}
                </p>
                
                <div className="flex items-center text-sm font-medium text-muted-foreground">
                  <time dateTime={String(post.createdAt)}>
                    {format(new Date(post.createdAt), "MMMM d, yyyy")}
                  </time>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
