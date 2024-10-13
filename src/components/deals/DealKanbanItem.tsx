"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  GripHorizontal,
  MailIcon,
  MoreVertical,
  PhoneIcon,
} from "lucide-react";
import { formatDate } from "@/utils";
import { DealWithPrimaryContact } from "@/types/entities";
import { z } from "zod";
const emailSchema = z.string().email();
const phoneSchema = z.string().min(7);

export function DealKanbanItem({ deal }: { deal: DealWithPrimaryContact }) {
  const contact = deal.primaryContact;
  const isValidEmail = emailSchema.safeParse(
    contact?.contactEmail?.email,
  ).success;
  const isValidPhone = phoneSchema.safeParse(
    contact?.contactPhone?.phoneNumber,
  ).success;
  contact?.contactEmail?.email && contact?.contactEmail?.email.length > 0;
  return (
    <Card
      key={deal.id}
      className="grid"
      style={{
        backgroundColor: `rgba(${parseInt(deal.stage.color.slice(0, 2), 16)}, ${parseInt(deal.stage.color.slice(2, 4), 16)}, ${parseInt(deal.stage.color.slice(4, 6), 16)}, 0.025)`,
      }}
    >
      <div className="flex items-start justify-between p-2">
        <div>
          <h1 className="flex max-w-[11rem] gap-0.5 text-sm font-light">
            <span className="max-w-[7rem] truncate !font-medium">
              {deal.title}
            </span>
            (<span className="max-w-[4rem] truncate">${deal.value}</span>)
          </h1>
          <p className="text-xs text-gray-800">
            {deal.probability && (
              <>
                <span className="font-medium">{deal.probability}%</span>{" "}
                probability on{" "}
              </>
            )}
            <span className="font-medium">
              {formatDate(deal?.expectedCloseDate) ?? "\u3164"}
            </span>
          </p>
        </div>
        <div
          className={`flex-col items-center ${deal.primaryContact ? "mt-1" : ""}`}
        >
          <Button size="icon" variant="outline" className="mr-1 h-6 w-6">
            <MoreVertical className="h-4 w-4 p-[0.05rem]" />
          </Button>
        </div>
      </div>
      {contact && (
        <div className="p-2 pt-0">
          <Card key={contact?.id} className="cursor-pointer">
            <div className="flex w-full items-center justify-between px-2 py-2 text-sm">
              <h1 className="max-w-[6rem] truncate">{contact?.contactName}</h1>
              <div className="flex items-center gap-1">
                <div className="flex space-x-1">
                  {isValidPhone && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-7 rounded-l"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${contact?.contactPhone?.countryCode ?? ""}${contact?.contactPhone?.phoneNumber ?? ""}`;
                      }}
                    >
                      <PhoneIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {isValidEmail && (
                    <Button
                      size="icon"
                      variant="outline"
                      className={`h-6 w-7 ${isValidPhone ? "rounded-r" : "rounded"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${contact?.contactEmail?.email ?? ""}`;
                      }}
                    >
                      <MailIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
