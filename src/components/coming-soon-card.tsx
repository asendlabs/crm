import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Mail, Zap, BarChart, Users } from "lucide-react";
import React from "react";
export function ComingSoonCard() {
  return (
    <Card className="w-5xl mx-auto px-6 py-10 !opacity-50">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-3xl font-bold">Coming soon</h2>
        <p className="text-muted-foreground">
          We are working hard to bring you these amazing features.
        </p>
      </div>
      <div className="grid items-center justify-center gap-5">
        <div className="flex items-center gap-4">
          <FeatureCard
            icon={Mail}
            title="Email Integration"
            color="text-pink-500"
          />
          <FeatureCard
            icon={Zap}
            title="Zapier Integration"
            color="text-yellow-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <FeatureCard icon={BarChart} title="Reports" color="text-green-500" />
          <FeatureCard icon={Users} title="Team" color="text-blue-500" />
        </div>
      </div>
    </Card>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  color,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
}) {
  return (
    <Card className="flex h-40 w-56 cursor-pointer flex-col items-center justify-center !opacity-50 transition-all hover:!opacity-100 hover:shadow-lg">
      <CardContent className="p-6 text-center">
        <Icon className={`h-14 w-14 hover:${color} mx-auto mb-4`} />
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardContent>
    </Card>
  );
}
