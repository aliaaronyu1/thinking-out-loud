import { usePost, useDeletePost } from "@/hooks/use-posts";
import { Link, useLocation, useParams } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Edit2, Trash2, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function PostView() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const postId = id ? parseInt(id, 10) : null;
  const { data: post, isLoading, error } = usePost(postId);
  
  const deleteMutation = useDeletePost();

  const handleDelete = async () => {
    if (!postId) return;
    try {
      await deleteMutation.mutateAsync(postId);
      toast({
        title: "Post deleted",
        description: "Your entry has been permanently removed.",
      });
      setLocation("/");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-12 lg:py-20 lg:px-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-12 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">Entry not found</h2>
        <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist or was removed.</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto p-6 md:p-12 lg:py-20 lg:px-12 pb-32">
      <div className="flex items-center justify-between mb-12">
        <Button asChild variant="ghost" size="sm" className="rounded-full -ml-3 text-muted-foreground hover:text-foreground">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-full bg-background">
            <Link href={`/post/${post.id}/edit`}>
              <Edit2 className="h-3.5 w-3.5 mr-2" />
              Edit
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-serif">Delete this entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground tracking-tight leading-tight mb-6">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground/80">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 opacity-70" />
            {format(new Date(post.createdAt), "MMMM d, yyyy")}
          </span>
          
          {post.status === "draft" && (
            <Badge variant="secondary" className="font-normal bg-amber-500/10 text-amber-700 shadow-none">
              Draft
            </Badge>
          )}
        </div>
      </header>

      <div className="border-t border-border/50 pt-12">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
}
