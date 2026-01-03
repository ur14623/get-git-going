import { MessageSquare, Smartphone, Bell, Mail, Send, CheckCircle, XCircle, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const channelData = [
  {
    type: "SMS",
    icon: MessageSquare,
    enabled: true,
    config: {
      templates: {
        english: "Hello {name}! Get 10 ETB cashback when you make any transaction today. Use M-Pesa now!",
        amharic: "ሰላም {name}! ዛሬ ማንኛውንም ግብይት ሲያደርጉ 10 ብር ካሽባክ ያግኙ። M-Pesa ን አሁን ይጠቀሙ!",
        oromifa: "Akkam {name}! Har'a daldala kamiyyuu yoo raawwattan 10 ETB cashback argadhu. M-Pesa amma fayyadami!",
        tigrinya: "ሰላም {name}! ሎሚ ዝኾነ ግብይት ምስ እትገብሩ 10 ብር ካሽባክ ርኸቡ። M-Pesa ሕጂ ተጠቀሙ!",
        somali: "Salaam {name}! Maanta haddii aad wax iibsato 10 ETB cashback hel. M-Pesa hadda isticmaal!",
      },
      personalization: ["name"],
      characterCount: 98,
    },
    metrics: {
      sent: 44200,
      delivered: 42300,
      failed: 1900,
    },
  },
  {
    type: "Push Notification",
    icon: Bell,
    enabled: true,
    config: {
      title: "🎉 Festive Rewards Await!",
      body: "Complete a transaction today and earn 10 ETB cashback instantly!",
      deepLink: "mpesa://rewards",
    },
    metrics: {
      sent: 38500,
      delivered: 35200,
      failed: 3300,
    },
  },
  {
    type: "USSD",
    icon: Smartphone,
    enabled: false,
    config: {
      pushText: "Dial *234# for festive rewards",
      sessionFlow: "Main Menu → Rewards → Claim",
    },
    metrics: {
      sent: 0,
      delivered: 0,
      failed: 0,
    },
  },
  {
    type: "Email",
    icon: Mail,
    enabled: false,
    config: {
      subject: "Your Festive Season Rewards",
      bodyPreview: "Dear valued customer, celebrate this festive season with exclusive M-Pesa rewards...",
    },
    metrics: {
      sent: 0,
      delivered: 0,
      failed: 0,
    },
  },
];

const languageLabels: Record<string, string> = {
  english: "English",
  amharic: "Amharic",
  oromifa: "Oromifa",
  tigrinya: "Tigrinya",
  somali: "Somali",
};

export function ChannelsTab() {
  return (
    <div className="space-y-6">
      {channelData.map((channel) => (
        <div key={channel.type} className="bg-card border p-6 space-y-4">
          {/* Channel Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${channel.enabled ? "bg-primary/10" : "bg-muted"}`}>
                <channel.icon className={`w-5 h-5 ${channel.enabled ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h3 className="font-semibold">{channel.type}</h3>
                <Badge variant={channel.enabled ? "default" : "secondary"}>
                  {channel.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>

          {channel.enabled && (
            <>
              {/* Configuration */}
              <div className="border-t pt-4 space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Configuration</h4>
                
                {channel.type === "SMS" && channel.config.templates && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Message Templates (5 Languages)</span>
                      <Tabs defaultValue="english" className="mt-2">
                        <TabsList className="h-auto flex-wrap">
                          {Object.keys(channel.config.templates).map((lang) => (
                            <TabsTrigger key={lang} value={lang} className="text-xs">
                              {languageLabels[lang]}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {Object.entries(channel.config.templates).map(([lang, template]) => (
                          <TabsContent key={lang} value={lang}>
                            <div className="bg-muted/50 p-3 text-sm font-mono mt-2">
                              {template}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <span className="text-xs text-muted-foreground">Personalization Fields</span>
                        <div className="mt-1 flex gap-2">
                          {channel.config.personalization?.map((field) => (
                            <Badge key={field} variant="outline">{`{${field}}`}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Character Count</span>
                        <p className="mt-1 font-medium">{channel.config.characterCount} / 160</p>
                      </div>
                    </div>
                  </div>
                )}

                {channel.type === "Push Notification" && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Title</span>
                      <p className="mt-1 font-medium">{channel.config.title}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Body</span>
                      <div className="mt-1 bg-muted/50 p-3 text-sm">
                        {channel.config.body}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Deep Link</span>
                      <p className="mt-1 font-mono text-sm text-primary">{channel.config.deepLink}</p>
                    </div>
                  </div>
                )}

                {channel.type === "USSD" && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Push Text</span>
                      <p className="mt-1 font-medium">{channel.config.pushText}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Session Flow</span>
                      <p className="mt-1 font-mono text-sm">{channel.config.sessionFlow}</p>
                    </div>
                  </div>
                )}

                {channel.type === "Email" && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Subject</span>
                      <p className="mt-1 font-medium">{channel.config.subject}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Body Preview</span>
                      <div className="mt-1 bg-muted/50 p-3 text-sm">
                        {channel.config.bodyPreview}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Metrics */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Delivery Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between gap-3 bg-muted/30 p-3 border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-info/10">
                        <Send className="w-4 h-4 text-info" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{channel.metrics.sent.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Sent</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 bg-muted/30 p-3 border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-success/10">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{channel.metrics.delivered.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Delivered</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <Download className="w-3 h-3" />
                      Export
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-3 bg-muted/30 p-3 border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-destructive/10">
                        <XCircle className="w-4 h-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{channel.metrics.failed.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Failed</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <Download className="w-3 h-3" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
