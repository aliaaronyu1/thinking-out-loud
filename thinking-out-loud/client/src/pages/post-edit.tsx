import { useEffect } from "react";
import { usePost, useCreatePost, useUpdatePost } from "@/hooks/use-posts";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, FileText, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownRenderer } from "@/components/markdown-renderer";

const formSchema = z.object({
  title: z.string().min(1, "A title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Write something..."),
  status: z.enum(["draft", "published"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function PostEdit() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const postId = id ? parseInt(id, 10) : null;
  const isEditing = !!postId;
  
  const { data: post, isLoading: isLoadingPost } = usePost(postId);
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (post && isEditing) {
      form.reset({
        title: post.title,
        content: post.content,
        status: post.status as "draft" | "published",
      });
    }
  }, [post, isEditing, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing && postId) {
        await updateMutation.mutateAsync({ id: postId, ...values });
        toast({ title: "Saved successfully" });
        setLocation(`/post/${postId}`);
      } else {
        const newPost = await createMutation.mutateAsync(values);
        toast({ title: "Created successfully" });
        setLocation(`/post/${newPost.id}`);
      }
    } catch (error) {
      toast({
        title: "Error saving post",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingPost) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between p-4 md:px-8 border-b border-border/50 shrink-0 sticky top-0 bg-background/80 backdrop-blur-md z-10">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full text-muted-foreground"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[120px] rounded-full h-9 bg-background border-border shadow-sm">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                size="sm" 
                className="rounded-full shadow-md hover:-translate-y-0.5 transition-transform"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
            <div className="max-w-3xl mx-auto space-y-8 h-full flex flex-col">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Give it a title..."
                        className="text-3xl md:text-5xl font-serif font-semibold h-auto py-3 px-0 border-0 focus-visible:ring-0 placeholder:text-muted-foreground/40 bg-transparent text-foreground shadow-none rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Tabs defaultValue="write" className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
                  <TabsList className="bg-transparent p-0 h-auto gap-4">
                    <TabsTrigger 
                      value="write" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 data-[state=active]:shadow-none font-medium text-muted-foreground data-[state=active]:text-foreground"
                    >
                      <FileText className="h-4 w-4 mr-2" /> Write
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preview"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 data-[state=active]:shadow-none font-medium text-muted-foreground data-[state=active]:text-foreground"
                    >
                      <Info className="h-4 w-4 mr-2" /> Preview
                    </TabsTrigger>
                  </TabsList>
                  <div className="text-xs text-muted-foreground font-mono opacity-60 hidden sm:block">
                    Markdown supported
                  </div>
                </div>

                <TabsContent value="write" className="flex-1 mt-0 pb-12 outline-none">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="h-full">
                        <FormControl>
                          <Textarea
                            placeholder="Start writing... don't think too hard about it."
                            className="w-full h-[60vh] min-h-[500px] resize-none border-0 focus-visible:ring-0 p-0 text-lg leading-relaxed font-serif bg-transparent placeholder:text-muted-foreground/40 placeholder:font-serif shadow-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="flex-1 mt-0 pb-12 min-h-[500px]">
                  {form.watch("content") ? (
                    <MarkdownRenderer content={form.watch("content")} />
                  ) : (
                    <p className="text-muted-foreground font-serif italic">Nothing to preview yet.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
