import { useState } from "react";
import { Search, Users, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CampaignFormData } from "@/pages/CampaignCreate";

interface AudienceSelectionStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

const segments = [
  {
    id: "seg-1",
    name: "High Value Active",
    customerCount: 45000,
    activePercent: 95,
    dormantPercent: 5,
    highValue: 60,
    mediumValue: 30,
    lowValue: 10,
    status: "Active",
  },
  {
    id: "seg-2",
    name: "Dormant 60 Days",
    customerCount: 28000,
    activePercent: 0,
    dormantPercent: 100,
    highValue: 15,
    mediumValue: 35,
    lowValue: 50,
    status: "Active",
  },
  {
    id: "seg-3",
    name: "Youth Urban",
    customerCount: 78000,
    activePercent: 72,
    dormantPercent: 28,
    highValue: 25,
    mediumValue: 45,
    lowValue: 30,
    status: "Active",
  },
  {
    id: "seg-4",
    name: "Rural Farmers",
    customerCount: 52000,
    activePercent: 68,
    dormantPercent: 32,
    highValue: 20,
    mediumValue: 40,
    lowValue: 40,
    status: "Active",
  },
  {
    id: "seg-5",
    name: "Business Owners",
    customerCount: 15000,
    activePercent: 88,
    dormantPercent: 12,
    highValue: 70,
    mediumValue: 25,
    lowValue: 5,
    status: "Active",
  },
];

export function AudienceSelectionStep({ formData, updateFormData }: AudienceSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSegments = segments.filter((seg) =>
    seg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSegment = (segment: typeof segments[0]) => {
    updateFormData({
      segmentId: segment.id,
      segmentName: segment.name,
      totalCustomers: segment.customerCount,
      activePercent: segment.activePercent,
      dormantPercent: segment.dormantPercent,
      highValue: segment.highValue,
      mediumValue: segment.mediumValue,
      lowValue: segment.lowValue,
    });
  };

  const selectedSegment = segments.find((s) => s.id === formData.segmentId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Audience Selection</h2>
        <p className="text-sm text-muted-foreground">Choose who will receive the campaign</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segment Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Segment Name</TableHead>
                  <TableHead className="font-semibold">Customers</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSegments.map((segment) => (
                  <TableRow
                    key={segment.id}
                    className={`hover:bg-muted/30 transition-colors ${
                      formData.segmentId === segment.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                    }`}
                  >
                    <TableCell className="font-medium">{segment.name}</TableCell>
                    <TableCell>{segment.customerCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {segment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={formData.segmentId === segment.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSelectSegment(segment)}
                      >
                        {formData.segmentId === segment.id ? "Selected" : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Audience Summary Panel */}
        <div className="space-y-4">
          <h3 className="font-semibold">Audience Summary</h3>
          {selectedSegment ? (
            <div className="border p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Segment Name</p>
                <p className="font-medium">{selectedSegment.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <p className="text-xl font-bold">{selectedSegment.customerCount.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-success/10 border border-success/20">
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs">Active</span>
                  </div>
                  <p className="text-lg font-bold">{selectedSegment.activePercent}%</p>
                </div>
                <div className="p-3 bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-1 text-warning">
                    <TrendingDown className="w-3 h-3" />
                    <span className="text-xs">Dormant</span>
                  </div>
                  <p className="text-lg font-bold">{selectedSegment.dormantPercent}%</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Value Split</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>High Value</span>
                    <span className="font-medium">{selectedSegment.highValue}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${selectedSegment.highValue}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Medium Value</span>
                    <span className="font-medium">{selectedSegment.mediumValue}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted">
                    <div
                      className="h-full bg-info"
                      style={{ width: `${selectedSegment.mediumValue}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Low Value</span>
                    <span className="font-medium">{selectedSegment.lowValue}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted">
                    <div
                      className="h-full bg-warning"
                      style={{ width: `${selectedSegment.lowValue}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border p-6 text-center text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Select a segment to see summary</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
