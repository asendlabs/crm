import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { DealWithPrimaryContact } from "@/types/entities";
import { useEffect, useState } from "react";
import { MailIcon, MoreVertical, PhoneIcon } from "lucide-react";
import { Button } from "../ui/button";
import { formatDate } from "@/utils";
import { z } from "zod";
import { cn } from "@/utils/tailwind";

interface DealCardProps {
  deal: DealWithPrimaryContact;
  isOverlay?: boolean;
}

export type DealType = "Deal";

export interface DealDragData {
  type: DealType;
  deal: DealWithPrimaryContact;
}
const emailSchema = z.string().email();
const phoneSchema = z.string().min(7);

export function DealKanbanCard({ deal, isOverlay }: DealCardProps) {
  const [cardHover, setCardHover] = useState(false);
  const [describedById, setDescribedById] = useState<string | null>(null);

  useEffect(() => {
    // Generate the ID only on the client
    setDescribedById(`DndDescribedBy-${deal.id}`);
  }, [deal.id]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    data: {
      type: "Deal",
      deal,
    } satisfies DealDragData,
    attributes: {
      roleDescription: "Deal",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const contact = deal.primaryContact;
  const isValidEmail = emailSchema.safeParse(
    contact?.contactEmail?.email,
  ).success;
  const isValidPhone = phoneSchema.safeParse(
    contact?.contactPhone?.phoneNumber,
  ).success;

  const variants = cva("cursor-grab grid", {
    variants: {
      dragging: {
        over: "ring-1 opacity-30 ring-muted-foreground/60",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
      // style={{
      //   backgroundColor: `rgba(${parseInt(deal.stage.color.slice(0, 2), 16)}, ${parseInt(deal.stage.color.slice(2, 4), 16)}, ${parseInt(deal.stage.color.slice(4, 6), 16)}, 0.025)`,
      // }}
    >
      <div className="flex items-start justify-between px-2 pb-4 pt-2">
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
          <Button
            size="icon"
            variant="outline"
            className={cn("mr-1 hidden h-6 w-6", cardHover && "flex")}
          >
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
