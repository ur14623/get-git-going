import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Segmentation from "./pages/Segmentation";
import SegmentDetail from "./pages/SegmentDetail";
import SegmentCreation from "./pages/SegmentCreation";
import Campaigns from "./pages/Campaigns";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignDetail from "./pages/CampaignDetail";
import AIInsights from "./pages/AIInsights";
import Customer360 from "./pages/Customer360";
import Reports from "./pages/Reports";
import RewardAccountManagement from "./pages/RewardAccountManagement";
import Configuration from "./pages/Configuration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/segmentation" element={<Segmentation />} />
                  <Route path="/segmentation/create" element={<SegmentCreation />} />
                  <Route path="/segmentation/:id" element={<SegmentDetail />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/campaigns/create" element={<CampaignCreate />} />
                  <Route path="/campaigns/:id" element={<CampaignDetail />} />
                  <Route path="/ai-insights" element={<AIInsights />} />
                  <Route path="/customer-360" element={<Customer360 />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/reward-accounts" element={<RewardAccountManagement />} />
                  <Route path="/configuration" element={<Configuration />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
