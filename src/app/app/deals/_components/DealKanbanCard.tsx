import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { DealWithPrimaryContact } from "@/types/entities";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Loader,
  MailIcon,
  MoreVertical,
  MoreVerticalIcon,
  PhoneIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatMinimal } from "@/lib/utils";
import { z } from "zod";
import { cn } from "@/lib/utils/tailwind";
import { toast } from "sonner";
import { useRouter } from "@/hooks/use-performance-router";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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

  const variants = cva("z-30 grid cursor-grab", {
    variants: {
      dragging: {
        over: "!m-0 bg-muted !p-0 opacity-30",
        overlay: "",
      },
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  return isDragging ? (
    <div
      className="z-50 m-0 flex h-32 w-full flex-col items-start rounded-lg opacity-50 ring-1 ring-inset ring-primary"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onMouseEnter={() => {
        setCardHover(true);
        router.prefetch(
          `/app/${deal.account?.type + "s"}/${deal.accountId}?deal=${deal.id}`,
        );
      }}
      onMouseLeave={() => setCardHover(false)}
      style={{
        ...style,
        backgroundColor: `rgba(${parseInt(deal.stage.color.slice(0, 2), 16)}, ${parseInt(deal.stage.color.slice(2, 4), 16)}, ${parseInt(deal.stage.color.slice(4, 6), 16)}, 0.025)`,
      }}
    ></div>
  ) : (
    <Card
      ref={setNodeRef}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
      {...attributes}
      {...listeners}
      onMouseEnter={() => {
        setCardHover(true);
        router.prefetch(
          `/app/${deal.account?.type + "s"}/${deal.accountId}?deal=${deal.id}`,
        );
      }}
      onMouseLeave={() => setCardHover(false)}
      style={{
        ...style,
        backgroundColor: `rgba(${parseInt(deal.stage.color.slice(0, 2), 16)}, ${parseInt(deal.stage.color.slice(2, 4), 16)}, ${parseInt(deal.stage.color.slice(4, 6), 16)}, 0.025)`,
      }}
    >
      <div className="flex items-start justify-between p-3">
        <div
          className={cn("grid !cursor-pointer gap-2", {
            "!cursor-grab": isOverlay || isDragging,
          })}
          onClick={() => {
            setLoading(true);
            router.push(
              `/app/${deal.account?.type + "s"}/${deal.accountId.toLowerCase()}?deal=${deal.id.toLowerCase()}`,
            );
          }}
        >
          <h1 className="break-words text-base font-medium hover:underline">
            {deal.title}
          </h1>
          <p className="flex max-w-[13rem] items-center gap-1.5 truncate text-xs">
            <span className="font-medium lowercase opacity-80">
              {deal.account?.type}:
            </span>
            <span className="truncate rounded-md border px-2 font-medium">
              {deal.account?.accountName}
            </span>
          </p>
          <p className="flex max-w-[13rem] items-center gap-1.5 truncate text-xs">
            <span className="font-medium opacity-80">value</span>
            <span className="truncate rounded-md border px-2 font-medium">
              {"$" + deal.value}
            </span>
          </p>
          <p className="flex gap-1.5 text-xs">
            <span className="font-medium opacity-80">close date</span>
            <span className="font-medium lowercase">
              {formatMinimal({
                dateString: deal?.expectedCloseDate,
                showTime: false,
              }) ?? "\u3164"}
            </span>
          </p>
        </div>
        <div
          className={`flex-col items-center ${deal.primaryContact ? "" : " "}`}
        >
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-7"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              router.push(
                `/app/${deal.account?.type + "s"}/${deal.accountId}?deal=${deal.id}`,
              );
            }}
          >
            {loading ? (
              <Loader className="size-4 animate-spin p-[0.05rem]" />
            ) : (
              <ArrowUpRight className="size-4 p-[0.05rem]" />
            )}
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
                      <PhoneIcon className="size-4" />
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
                      <MailIcon className="size-4" />
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
