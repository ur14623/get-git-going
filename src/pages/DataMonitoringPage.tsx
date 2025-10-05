import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./data-monitoring/OverviewTab";
import { LookupDataTab } from "./data-monitoring/LookupDataTab";
import { RejectedDataTab } from "./data-monitoring/RejectedDataTab";
import { BufferedDataTab } from "./data-monitoring/BufferedDataTab";

export function DataMonitoringPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Data Monitoring</h1>
            <p className="text-muted-foreground">Monitor system KPIs, stream throughput, and data processing</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lookup">Lookup Data</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Data</TabsTrigger>
            <TabsTrigger value="buffered">Buffered Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="lookup">
            <LookupDataTab />
          </TabsContent>

          <TabsContent value="rejected">
            <RejectedDataTab />
          </TabsContent>

          <TabsContent value="buffered">
            <BufferedDataTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
