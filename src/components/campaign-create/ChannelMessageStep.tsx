import { MessageSquare, Smartphone, Bell, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CampaignFormData } from "@/pages/CampaignCreate";

interface ChannelMessageStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

const personalizationTokens = [
  "{{first_name}}",
  "{{last_name}}",
  "{{msisdn_masked}}",
  "{{balance}}",
  "{{reward_amount}}",
];

export function ChannelMessageStep({ formData, updateFormData }: ChannelMessageStepProps) {
  const handleChannelChange = (channel: keyof typeof formData.channels, checked: boolean) => {
    updateFormData({
      channels: {
        ...formData.channels,
        [channel]: checked,
      },
    });
  };

  const handleMessageChange = (field: keyof typeof formData.messages, value: string) => {
    updateFormData({
      messages: {
        ...formData.messages,
        [field]: value,
      },
    });
  };

  const getSmsCharCount = () => formData.messages.sms.length;
  const getSmsCredits = () => Math.ceil(formData.messages.sms.length / 160) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Channel & Message</h2>
        <p className="text-sm text-muted-foreground">Define how customers will be contacted</p>
      </div>

      {/* Channel Selection */}
      <div className="space-y-3">
        <Label>Select Channels</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.channels.sms ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={formData.channels.sms}
              onCheckedChange={(checked) => handleChannelChange("sms", !!checked)}
            />
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">SMS</span>
          </label>
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.channels.ussd ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={formData.channels.ussd}
              onCheckedChange={(checked) => handleChannelChange("ussd", !!checked)}
            />
            <Smartphone className="w-5 h-5" />
            <span className="font-medium">USSD Push</span>
          </label>
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.channels.app ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={formData.channels.app}
              onCheckedChange={(checked) => handleChannelChange("app", !!checked)}
            />
            <Bell className="w-5 h-5" />
            <span className="font-medium">App Notification</span>
          </label>
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.channels.email ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={formData.channels.email}
              onCheckedChange={(checked) => handleChannelChange("email", !!checked)}
            />
            <Mail className="w-5 h-5" />
            <span className="font-medium">Email</span>
          </label>
        </div>
      </div>

      {/* Personalization Tokens */}
      <div className="space-y-2">
        <Label>Personalization Tokens</Label>
        <div className="flex flex-wrap gap-2">
          {personalizationTokens.map((token) => (
            <Badge key={token} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              {token}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Click to copy, then paste into your message</p>
      </div>

      {/* Message Editors */}
      <div className="space-y-6">
        {formData.channels.sms && (
          <div className="border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <Label>SMS Message</Label>
            </div>
            <Textarea
              placeholder="Enter your SMS message..."
              value={formData.messages.sms}
              onChange={(e) => handleMessageChange("sms", e.target.value)}
              rows={4}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {getSmsCharCount()} characters ({getSmsCredits()} SMS credit{getSmsCredits() !== 1 ? "s" : ""})
              </span>
              {getSmsCharCount() > 160 && (
                <span className="text-warning">Long message - will be split</span>
              )}
            </div>
            {/* Preview */}
            <div className="bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">Preview</p>
              <p className="text-sm whitespace-pre-wrap">
                {formData.messages.sms || "Your message will appear here..."}
              </p>
            </div>
          </div>
        )}

        {formData.channels.ussd && (
          <div className="border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <Label>USSD Push Message</Label>
            </div>
            <Textarea
              placeholder="Enter USSD push message..."
              value={formData.messages.ussd}
              onChange={(e) => handleMessageChange("ussd", e.target.value)}
              rows={3}
            />
            <div className="bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">Session Preview</p>
              <div className="font-mono text-sm bg-background p-2 border">
                {formData.messages.ussd || "USSD message preview..."}
              </div>
            </div>
          </div>
        )}

        {formData.channels.app && (
          <div className="border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <Label>App Notification</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm">Title</Label>
                <Input
                  placeholder="Notification title"
                  value={formData.messages.appTitle}
                  onChange={(e) => handleMessageChange("appTitle", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Deep Link (Optional)</Label>
                <Input
                  placeholder="app://screen/action"
                  value={formData.messages.appDeepLink}
                  onChange={(e) => handleMessageChange("appDeepLink", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Body</Label>
              <Textarea
                placeholder="Notification body..."
                value={formData.messages.appBody}
                onChange={(e) => handleMessageChange("appBody", e.target.value)}
                rows={2}
              />
            </div>
            {/* Mobile Preview */}
            <div className="bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-2">Mobile Preview</p>
              <div className="bg-background border p-3 max-w-xs">
                <p className="font-semibold text-sm">{formData.messages.appTitle || "Title"}</p>
                <p className="text-sm text-muted-foreground">{formData.messages.appBody || "Body text..."}</p>
              </div>
            </div>
          </div>
        )}

        {formData.channels.email && (
          <div className="border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <Label>Email</Label>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Subject</Label>
              <Input
                placeholder="Email subject line"
                value={formData.messages.emailSubject}
                onChange={(e) => handleMessageChange("emailSubject", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Body</Label>
              <Textarea
                placeholder="Email body content..."
                value={formData.messages.emailBody}
                onChange={(e) => handleMessageChange("emailBody", e.target.value)}
                rows={4}
              />
            </div>
            {/* Email Preview */}
            <div className="bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-2">Email Preview</p>
              <div className="bg-background border p-4">
                <p className="font-semibold mb-2">{formData.messages.emailSubject || "Subject"}</p>
                <p className="text-sm whitespace-pre-wrap">
                  {formData.messages.emailBody || "Email body will appear here..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {!Object.values(formData.channels).some((v) => v) && (
          <div className="border p-8 text-center text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Select a channel above to configure messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
