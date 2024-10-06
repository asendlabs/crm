import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/env";
import { Copy, CopyCheck } from "lucide-react";

export default function AccountShareDialog({
  entityId,
  entityType,
}: {
  entityId: string;
  entityType: string;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${env.NEXT_PUBLIC_URL}/app/${entityId.toLowerCase()}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary">
        Share this {entityType}
      </h1>
      <p className="text-sm text-gray-500">
        Only people who are in your workspace view this {entityType}.
      </p>
      <div className="flex space-x-2 py-2 pt-3">
        <Input value={shareUrl} readOnly className="flex-grow" />
        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="h-full gap-1.5 whitespace-nowrap transition-colors hover:bg-muted hover:text-primary"
        >
          {copied ? (
            <>
              <CopyCheck className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
