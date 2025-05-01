import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./contexts/ThemeContext";
import MainLayout from "./components/layout/main-layout";
import Dashboard from "./pages/dashboard";
import JudicialDecisions from "./pages/judicial-decisions";
import LaborContracts from "./pages/labor-contracts";
import AiInsights from "./pages/ai-insights";
import Favorites from "./pages/favorites";
import RecentActivity from "./pages/recent-activity";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/judicial-decisions" component={JudicialDecisions} />
        <Route path="/labor-contracts" component={LaborContracts} />
        <Route path="/ai-insights" component={AiInsights} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/recent-activity" component={RecentActivity} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
