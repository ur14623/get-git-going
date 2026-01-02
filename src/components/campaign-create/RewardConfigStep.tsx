import { Gift, Wallet, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CampaignFormData } from "@/pages/CampaignCreate";

interface RewardConfigStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

const rewardAccounts = [
  { id: "acc-1", name: "Main Rewards Pool", balance: 5000000, reserved: 1200000, currency: "ETB" },
  { id: "acc-2", name: "Promo Budget Q1", balance: 2500000, reserved: 500000, currency: "ETB" },
  { id: "acc-3", name: "Win-back Fund", balance: 800000, reserved: 150000, currency: "ETB" },
];

export function RewardConfigStep({ formData, updateFormData }: RewardConfigStepProps) {
  const selectedAccount = rewardAccounts.find((a) => a.id === formData.rewardAccountId);
  const availableBalance = selectedAccount ? selectedAccount.balance - selectedAccount.reserved : 0;
  
  const estimatedCost = formData.enableReward && formData.rewardValue && formData.totalCustomers
    ? formData.rewardValue * formData.totalCustomers
    : 0;
  
  const isInsufficientBalance = estimatedCost > availableBalance && formData.enableReward;

  const handleAccountSelect = (accountId: string) => {
    const account = rewardAccounts.find((a) => a.id === accountId);
    if (account) {
      updateFormData({
        rewardAccountId: account.id,
        rewardAccountName: account.name,
        rewardAccountBalance: account.balance - account.reserved,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold mb-1">Reward Configuration</h2>
        <p className="text-sm text-muted-foreground">Configure incentives for this campaign (optional)</p>
      </div>

      {/* Enable Reward Toggle */}
      <div className="flex items-center justify-between p-4 border">
        <div className="flex items-center gap-3">
          <Gift className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium">Enable Reward</p>
            <p className="text-sm text-muted-foreground">Add incentives to this campaign</p>
          </div>
        </div>
        <Switch
          checked={formData.enableReward}
          onCheckedChange={(checked) => updateFormData({ enableReward: checked })}
        />
      </div>

      {formData.enableReward && (
        <div className="space-y-4 p-4 border bg-muted/20">
          {/* Reward Type */}
          <div className="space-y-2">
            <Label>Reward Type</Label>
            <Select
              value={formData.rewardType}
              onValueChange={(value) => updateFormData({ rewardType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reward type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="cashback">Cashback Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reward Value */}
          <div className="space-y-2">
            <Label>
              Reward Value ({formData.rewardType === "cashback" ? "%" : "ETB"})
            </Label>
            <Input
              type="number"
              placeholder={formData.rewardType === "cashback" ? "Enter percentage" : "Enter amount"}
              value={formData.rewardValue || ""}
              onChange={(e) => updateFormData({ rewardValue: Number(e.target.value) })}
            />
          </div>

          {/* Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Per-Customer Limit</Label>
              <Input
                type="number"
                placeholder="Max per customer"
                value={formData.perCustomerLimit || ""}
                onChange={(e) => updateFormData({ perCustomerLimit: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Campaign Cap (ETB)</Label>
              <Input
                type="number"
                placeholder="Total budget cap"
                value={formData.campaignCap || ""}
                onChange={(e) => updateFormData({ campaignCap: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Reward Account Selection */}
          <div className="space-y-2">
            <Label>Reward Account</Label>
            <Select
              value={formData.rewardAccountId}
              onValueChange={handleAccountSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reward account" />
              </SelectTrigger>
              <SelectContent>
                {rewardAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{account.name}</span>
                      <span className="text-muted-foreground">
                        {(account.balance - account.reserved).toLocaleString()} {account.currency} available
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account Balance Display */}
          {selectedAccount && (
            <div className="p-4 border bg-background space-y-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="font-medium">{selectedAccount.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Current Balance</p>
                  <p className="font-semibold">{selectedAccount.balance.toLocaleString()} ETB</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reserved</p>
                  <p className="font-semibold text-warning">{selectedAccount.reserved.toLocaleString()} ETB</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Available</p>
                  <p className="font-semibold text-success">{availableBalance.toLocaleString()} ETB</p>
                </div>
              </div>
            </div>
          )}

          {/* Estimated Cost */}
          {formData.totalCustomers > 0 && formData.rewardValue > 0 && (
            <div className={`p-4 border ${isInsufficientBalance ? "border-destructive bg-destructive/5" : "bg-info/5 border-info/20"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Total Cost</p>
                  <p className="text-xl font-bold">
                    {estimatedCost.toLocaleString()} ETB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formData.rewardValue} ETB × {formData.totalCustomers.toLocaleString()} customers
                  </p>
                </div>
                {isInsufficientBalance && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm font-medium">Insufficient Balance</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
