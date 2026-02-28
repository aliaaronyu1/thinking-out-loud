import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@shared/routes";
import { NewsItem } from "@shared/schema";
import { ExternalLink } from "lucide-react";

export default function News() {
  const { data: articles, isLoading, error } = useQuery<NewsItem[]>({
    queryKey: [api.news.list.path],
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-bold mb-4">Daily Inspiration</h1>
        <p className="text-muted-foreground text-lg">Curated news to spark your thinking.</p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-border/50 shadow-none rounded-2xl overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5 p-8 text-center rounded-2xl">
          <p className="text-destructive font-medium">Failed to load news. Please try again later.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles?.map((article, idx) => (
            <Card key={idx} className="group border-border/50 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5 rounded-2xl overflow-hidden flex flex-col h-full bg-card/50 backdrop-blur-sm">
              {article.urlToImage && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {article.source.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="font-serif text-xl leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 mt-auto">
                <CardDescription className="line-clamp-2 mb-6 text-muted-foreground/80">
                  {article.description}
                </CardDescription>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Read full article
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
