import { AlertTriangle, Users, MessageSquare, Gift, Calendar, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CampaignFormData } from "@/pages/CampaignCreate";

interface ReviewSubmitStepProps {
  formData: CampaignFormData;
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    informational: "Informational",
    incentive: "Incentive",
    winback: "Win-back",
    crosssell: "Cross-sell",
  };
  return labels[type] || type;
};

const getObjectiveLabel = (objective: string) => {
  const labels: Record<string, string> = {
    activation: "Activation",
    reactivation: "Reactivation",
    frequency: "Frequency Increase",
    value: "Value Increase",
  };
  return labels[objective] || objective;
};

export function ReviewSubmitStep({ formData }: ReviewSubmitStepProps) {
  const selectedChannels = Object.entries(formData.channels)
    .filter(([_, enabled]) => enabled)
    .map(([channel]) => channel.toUpperCase());

  const estimatedCost = formData.enableReward
    ? formData.rewardValue * formData.totalCustomers
    : 0;

  const warnings: string[] = [];
  if (formData.totalCustomers > 100000) {
    warnings.push("Large audience: This campaign targets over 100,000 customers");
  }
  if (estimatedCost > 1000000) {
    warnings.push("High cost: Estimated reward cost exceeds 1,000,000 ETB");
  }
  if (formData.enableReward && formData.type === "informational") {
    warnings.push("Reward dependency: Informational campaigns typically don't include rewards");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Review & Submit</h2>
        <p className="text-sm text-muted-foreground">Verify all details before launching</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Summary */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <CheckCircle className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Campaign Summary</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <Badge variant="outline">{getTypeLabel(formData.type)}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Objective</span>
              <span className="font-medium">{getObjectiveLabel(formData.objective)}</span>
            </div>
            {formData.description && (
              <div>
                <span className="text-muted-foreground">Description</span>
                <p className="mt-1">{formData.description}</p>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Owner</span>
              <span className="font-medium">{formData.owner}</span>
            </div>
          </div>
        </div>

        {/* Audience Summary */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Audience Summary</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Segment</span>
              <span className="font-medium">{formData.segmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Customers</span>
              <span className="font-bold text-lg">{formData.totalCustomers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active / Dormant</span>
              <span>{formData.activePercent}% / {formData.dormantPercent}%</span>
            </div>
          </div>
        </div>

        {/* Channel Summary */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Channel Summary</h3>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {selectedChannels.map((channel) => (
                <Badge key={channel} variant="secondary">{channel}</Badge>
              ))}
            </div>
            {formData.channels.sms && (
              <div className="p-3 bg-muted text-sm">
                <p className="text-xs text-muted-foreground mb-1">SMS Message</p>
                <p className="line-clamp-2">{formData.messages.sms}</p>
              </div>
            )}
            {formData.channels.ussd && (
              <div className="p-3 bg-muted text-sm">
                <p className="text-xs text-muted-foreground mb-1">USSD Message</p>
                <p className="line-clamp-2">{formData.messages.ussd}</p>
              </div>
            )}
            {formData.channels.app && (
              <div className="p-3 bg-muted text-sm">
                <p className="text-xs text-muted-foreground mb-1">App Notification</p>
                <p className="font-medium">{formData.messages.appTitle}</p>
                <p className="line-clamp-2">{formData.messages.appBody}</p>
              </div>
            )}
            {formData.channels.email && (
              <div className="p-3 bg-muted text-sm">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{formData.messages.emailSubject}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reward Summary */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Gift className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Reward Summary</h3>
          </div>
          {formData.enableReward ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reward Type</span>
                <span className="font-medium capitalize">{formData.rewardType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reward Value</span>
                <span className="font-medium">
                  {formData.rewardValue} {formData.rewardType === "cashback" ? "%" : "ETB"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reward Account</span>
                <span className="font-medium">{formData.rewardAccountName}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-muted-foreground">Estimated Total Cost</span>
                <span className="font-bold text-lg">{estimatedCost.toLocaleString()} ETB</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No rewards configured</p>
          )}
        </div>

        {/* Schedule Summary */}
        <div className="border p-4 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Schedule & Controls</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Schedule Type</p>
              <p className="font-medium capitalize">{formData.scheduleType}</p>
            </div>
            {formData.scheduleType === "scheduled" && (
              <>
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formData.startDate} {formData.startTime}</p>
                </div>
                {formData.endDate && (
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{formData.endDate}</p>
                  </div>
                )}
              </>
            )}
            <div>
              <p className="text-muted-foreground">Frequency Cap</p>
              <p className="font-medium capitalize">{formData.frequencyCap}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Retry on Failure</p>
              <p className="font-medium">{formData.retryOnFailure ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings Panel */}
      {warnings.length > 0 && (
        <div className="border border-warning/30 bg-warning/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">Warnings</h3>
          </div>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-warning">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
