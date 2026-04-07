import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/hooks/use-locale";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Claim from "./pages/Claim";
import Dashboard from "./pages/Dashboard";
import PublicProfile from "./pages/PublicProfile";
import ApiDocs from "./pages/ApiDocs";
import XPlatformSetupDocs from "./pages/XPlatformSetupDocs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
    <LocaleProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/claim" element={<Claim />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/docs" element={<ApiDocs />} />
          <Route path="/docs/x-platform-setup" element={<XPlatformSetupDocs />} />
          <Route path="/:username" element={<PublicProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LocaleProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
