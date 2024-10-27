import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Mail, Zap, BarChart, Users } from "lucide-react";

export function ComingSoonCard() {
  return (
    <Card className="mx-auto w-5xl px-6 py-10 !opacity-50">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-3xl font-bold">Coming Soon</h2>
        <p className="text-muted-foreground">
            These features and many more are in development.
        </p>
      </div>
      <div className="grid gap-5 items-center justify-center">
        <div className="flex gap-4 items-center">
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
        <div className="flex gap-4 items-center">
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
    <Card className="flex h-40 w-56 flex-col items-center justify-center transition-all hover:shadow-lg cursor-pointer !opacity-50 hover:!opacity-100">
      <CardContent className="p-6 text-center">
        <Icon className={`h-14 w-14 hover:${color} mx-auto mb-4`} />
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardContent>
    </Card>
  );
}
