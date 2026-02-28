import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout";

// Pages
import Home from "@/pages/home";
import PostView from "@/pages/post-view";
import PostEdit from "@/pages/post-edit";
import News from "@/pages/news";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={() => <Home filter="all" />} />
        <Route path="/drafts" component={() => <Home filter="drafts" />} />
        <Route path="/news" component={News} />
        <Route path="/new" component={PostEdit} />
        <Route path="/post/:id" component={PostView} />
        <Route path="/post/:id/edit" component={PostEdit} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
