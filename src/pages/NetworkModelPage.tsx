import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllConnectionPointsTab } from "./network-model/AllConnectionPointsTab";
import { IncomingConnectionPointsTab } from "./network-model/IncomingConnectionPointsTab";
import { OutgoingConnectionPointsTab } from "./network-model/OutgoingConnectionPointsTab";

export function NetworkModelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Network Model</h1>
            <p className="text-muted-foreground">Manage and monitor all connection points</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Connection Points</TabsTrigger>
            <TabsTrigger value="incoming">Incoming Connection Points</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing Connection Points</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <AllConnectionPointsTab />
          </TabsContent>

          <TabsContent value="incoming">
            <IncomingConnectionPointsTab />
          </TabsContent>

          <TabsContent value="outgoing">
            <OutgoingConnectionPointsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
