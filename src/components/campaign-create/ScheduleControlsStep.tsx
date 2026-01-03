import { Calendar, Clock, Repeat, Zap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CampaignFormData } from "@/pages/CampaignCreate";

interface ScheduleControlsStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

const triggerOptions = [
  { value: "none", label: "No trigger" },
  { value: "inactivity", label: "After inactivity (X days)" },
  { value: "failed_txn", label: "After failed transaction" },
  { value: "reward_received", label: "After reward received" },
];

const frequencyOptions = [
  { value: "once", label: "Once per campaign" },
  { value: "daily", label: "Once per day" },
  { value: "weekly", label: "Once per week" },
];

const channelPriorityOptions = [
  { value: "sms", label: "SMS First" },
  { value: "ussd", label: "USSD First" },
  { value: "app", label: "App First" },
  { value: "email", label: "Email First" },
];

export function ScheduleControlsStep({ formData, updateFormData }: ScheduleControlsStepProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold mb-1">Schedule & Controls</h2>
        <p className="text-sm text-muted-foreground">Define when and how the campaign runs</p>
      </div>

      {/* Schedule Type */}
      <div className="space-y-3">
        <Label>Schedule Type</Label>
        <RadioGroup
          value={formData.scheduleType}
          onValueChange={(value) => updateFormData({ scheduleType: value })}
          className="flex flex-col gap-3"
        >
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.scheduleType === "immediate" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <RadioGroupItem value="immediate" id="immediate" />
            <Zap className="w-5 h-5" />
            <div>
              <p className="font-medium">Immediate</p>
              <p className="text-sm text-muted-foreground">Start campaign right after approval</p>
            </div>
          </label>
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.scheduleType === "scheduled" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <RadioGroupItem value="scheduled" id="scheduled" />
            <Calendar className="w-5 h-5" />
            <div>
              <p className="font-medium">Scheduled</p>
              <p className="text-sm text-muted-foreground">Set specific start date and time</p>
            </div>
          </label>
        </RadioGroup>
      </div>

      {/* Scheduled Date/Time */}
      {formData.scheduleType === "scheduled" && (
        <div className="p-4 border space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => updateFormData({ startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => updateFormData({ startTime: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>End Date (Optional)</Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => updateFormData({ endDate: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Leave empty for no end date</p>
          </div>
        </div>
      )}

      {/* Trigger Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <Label>Trigger (Optional)</Label>
        </div>
        <Select
          value={formData.triggerType}
          onValueChange={(value) => updateFormData({ triggerType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select trigger condition" />
          </SelectTrigger>
          <SelectContent>
            {triggerOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.triggerType === "inactivity" && (
          <div className="flex items-center gap-3 mt-2">
            <Label className="text-sm">Days of inactivity:</Label>
            <Input
              type="number"
              className="w-24"
              value={formData.triggerDays || ""}
              onChange={(e) => updateFormData({ triggerDays: Number(e.target.value) })}
              placeholder="30"
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Repeat className="w-4 h-4" />
          <Label>Controls</Label>
        </div>

        <div className="p-4 border space-y-4">
          <div className="space-y-2">
            <Label>Frequency Cap</Label>
            <Select
              value={formData.frequencyCap}
              onValueChange={(value) => updateFormData({ frequencyCap: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Channel Priority</Label>
            <Select
              value={formData.channelPriority}
              onValueChange={(value) => updateFormData({ channelPriority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {channelPriorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Determines which channel to try first when multiple are selected
            </p>
          </div>

          <div className="flex items-center justify-between p-3 border bg-muted/20">
            <div>
              <p className="font-medium text-sm">Retry on Failure</p>
              <p className="text-xs text-muted-foreground">Automatically retry failed deliveries</p>
            </div>
            <Switch
              checked={formData.retryOnFailure}
              onCheckedChange={(checked) => updateFormData({ retryOnFailure: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
