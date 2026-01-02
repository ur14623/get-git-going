import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { CampaignBasicsStep } from "@/components/campaign-create/CampaignBasicsStep";
import { AudienceSelectionStep } from "@/components/campaign-create/AudienceSelectionStep";
import { ChannelMessageStep } from "@/components/campaign-create/ChannelMessageStep";
import { RewardConfigStep } from "@/components/campaign-create/RewardConfigStep";
import { ScheduleControlsStep } from "@/components/campaign-create/ScheduleControlsStep";
import { ReviewSubmitStep } from "@/components/campaign-create/ReviewSubmitStep";

export interface CampaignFormData {
  // Step 1: Basics
  name: string;
  type: string;
  objective: string;
  description: string;
  owner: string;
  
  // Step 2: Audience
  segmentId: string;
  segmentName: string;
  totalCustomers: number;
  activePercent: number;
  dormantPercent: number;
  highValue: number;
  mediumValue: number;
  lowValue: number;
  
  // Step 3: Channels & Messages
  channels: {
    sms: boolean;
    ussd: boolean;
    app: boolean;
    email: boolean;
  };
  messages: {
    sms: string;
    ussd: string;
    appTitle: string;
    appBody: string;
    appDeepLink: string;
    emailSubject: string;
    emailBody: string;
  };
  
  // Step 4: Rewards
  enableReward: boolean;
  rewardType: string;
  rewardValue: number;
  perCustomerLimit: number;
  campaignCap: number;
  rewardAccountId: string;
  rewardAccountName: string;
  rewardAccountBalance: number;
  
  // Step 5: Schedule
  scheduleType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  triggerType: string;
  triggerDays: number;
  frequencyCap: string;
  channelPriority: string;
  retryOnFailure: boolean;
}

const initialFormData: CampaignFormData = {
  name: "",
  type: "",
  objective: "",
  description: "",
  owner: "Current User",
  
  segmentId: "",
  segmentName: "",
  totalCustomers: 0,
  activePercent: 0,
  dormantPercent: 0,
  highValue: 0,
  mediumValue: 0,
  lowValue: 0,
  
  channels: {
    sms: false,
    ussd: false,
    app: false,
    email: false,
  },
  messages: {
    sms: "",
    ussd: "",
    appTitle: "",
    appBody: "",
    appDeepLink: "",
    emailSubject: "",
    emailBody: "",
  },
  
  enableReward: false,
  rewardType: "fixed",
  rewardValue: 0,
  perCustomerLimit: 1,
  campaignCap: 0,
  rewardAccountId: "",
  rewardAccountName: "",
  rewardAccountBalance: 0,
  
  scheduleType: "immediate",
  startDate: "",
  startTime: "",
  endDate: "",
  triggerType: "",
  triggerDays: 0,
  frequencyCap: "daily",
  channelPriority: "sms",
  retryOnFailure: false,
};

const steps = [
  { id: 1, name: "Campaign Basics" },
  { id: 2, name: "Audience Selection" },
  { id: 3, name: "Channel & Message" },
  { id: 4, name: "Reward Configuration" },
  { id: 5, name: "Schedule & Controls" },
  { id: 6, name: "Review & Submit" },
];

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedSegment = searchParams.get("segment");
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>(() => {
    if (preSelectedSegment) {
      return {
        ...initialFormData,
        segmentId: preSelectedSegment,
        segmentName: "Pre-selected Segment",
        totalCustomers: 45000,
        activePercent: 78,
        dormantPercent: 22,
        highValue: 35,
        mediumValue: 45,
        lowValue: 20,
      };
    }
    return initialFormData;
  });

  const updateFormData = (updates: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.type || !formData.objective) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      case 2:
        if (!formData.segmentId) {
          toast.error("Please select a segment");
          return false;
        }
        return true;
      case 3:
        const hasChannel = Object.values(formData.channels).some(v => v);
        if (!hasChannel) {
          toast.error("Please select at least one channel");
          return false;
        }
        // Check if selected channels have messages
        if (formData.channels.sms && !formData.messages.sms) {
          toast.error("Please enter SMS message");
          return false;
        }
        if (formData.channels.ussd && !formData.messages.ussd) {
          toast.error("Please enter USSD message");
          return false;
        }
        if (formData.channels.app && (!formData.messages.appTitle || !formData.messages.appBody)) {
          toast.error("Please enter App notification title and body");
          return false;
        }
        if (formData.channels.email && (!formData.messages.emailSubject || !formData.messages.emailBody)) {
          toast.error("Please enter Email subject and body");
          return false;
        }
        return true;
      case 4:
        if (formData.enableReward) {
          if (!formData.rewardValue || formData.rewardValue <= 0) {
            toast.error("Please enter a valid reward value");
            return false;
          }
          if (!formData.rewardAccountId) {
            toast.error("Please select a reward account");
            return false;
          }
          const estimatedCost = formData.rewardValue * formData.totalCustomers;
          if (estimatedCost > formData.rewardAccountBalance) {
            toast.error("Insufficient balance in reward account");
            return false;
          }
        }
        return true;
      case 5:
        if (formData.scheduleType === "scheduled") {
          if (!formData.startDate || !formData.startTime) {
            toast.error("Please set start date and time");
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = () => {
    toast.success("Campaign saved as draft");
    navigate("/campaigns");
  };

  const handleSubmit = () => {
    toast.success("Campaign submitted for approval");
    navigate("/campaigns");
  };

  const handleCancel = () => {
    navigate("/campaigns");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CampaignBasicsStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <AudienceSelectionStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <ChannelMessageStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <RewardConfigStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <ScheduleControlsStep formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <ReviewSubmitStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Campaign</h1>
          <p className="text-muted-foreground">Configure and launch your engagement campaign</p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border p-4">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center border-2 font-medium text-sm ${
                    currentStep > step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "border-primary text-primary"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`text-xs mt-1 text-center max-w-[80px] ${
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card border p-6 min-h-[400px]">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex gap-3">
          {currentStep === 6 ? (
            <>
              <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
                <Save className="w-4 h-4" />
                Save as Draft
              </Button>
              <Button onClick={handleSubmit} className="gap-2">
                <Send className="w-4 h-4" />
                Submit for Approval
              </Button>
            </>
          ) : (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
