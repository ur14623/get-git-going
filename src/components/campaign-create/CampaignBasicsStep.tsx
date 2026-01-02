import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CampaignFormData } from "@/pages/CampaignCreate";

interface CampaignBasicsStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

const campaignTypes = [
  { value: "informational", label: "Informational" },
  { value: "incentive", label: "Incentive" },
  { value: "winback", label: "Win-back" },
  { value: "crosssell", label: "Cross-sell" },
];

const campaignObjectives = [
  { value: "activation", label: "Activation" },
  { value: "reactivation", label: "Reactivation" },
  { value: "frequency", label: "Frequency Increase" },
  { value: "value", label: "Value Increase" },
];

export function CampaignBasicsStep({ formData, updateFormData }: CampaignBasicsStepProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold mb-1">Campaign Basics</h2>
        <p className="text-sm text-muted-foreground">Define what this campaign is about</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Campaign Name <span className="text-destructive">*</span></Label>
          <Input
            id="name"
            placeholder="Enter campaign name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Campaign Type <span className="text-destructive">*</span></Label>
          <Select value={formData.type} onValueChange={(value) => updateFormData({ type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select campaign type" />
            </SelectTrigger>
            <SelectContent>
              {campaignTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="objective">Campaign Objective <span className="text-destructive">*</span></Label>
          <Select value={formData.objective} onValueChange={(value) => updateFormData({ objective: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select campaign objective" />
            </SelectTrigger>
            <SelectContent>
              {campaignObjectives.map((obj) => (
                <SelectItem key={obj.value} value={obj.value}>
                  {obj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe the campaign purpose and goals"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner">Owner</Label>
          <Input
            id="owner"
            value={formData.owner}
            disabled
            className="bg-muted"
          />
        </div>
      </div>
    </div>
  );
}
