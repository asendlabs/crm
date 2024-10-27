import { AccountContext } from "@/providers/accountProvider";
import React, { useContext, useMemo } from "react";
import { EmailCard } from "./EmailCard";
import { Button } from "@/components/ui/button";
import { Loader, RotateCcw } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useRouter } from "@/hooks/use-performance-router";

export function EmailPanel() {
  const { emails, contacts } = useContext(AccountContext);
  const router = useRouter({
    fancy: false,
  });

  // Get all contact email addresses
  const allContactEmailAddresses = useMemo(() => {
    return contacts?.map((contact) => contact.contactEmail?.email) || [];
  }, [contacts]);

  // Filter emails based on contacts' email addresses
  const filteredEmailsBasedOnContacts = useMemo(() => {
    return (
      emails?.filter((email) => {
        return (
          allContactEmailAddresses.includes(email.fromEmail) ||
          allContactEmailAddresses.includes(email.toEmail)
        );
      }) || []
    );
  }, [emails, allContactEmailAddresses]);

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <section className="grid w-full gap-3 pt-1.5">
      <section className="absolute right-[1rem] top-[4.12rem]">
        <div className="flex gap-2">
          <Button
            className="inline-flex h-8 w-8 gap-1.5 px-1.5 py-1"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Loader className="size-4 animate-spin" />
              </>
            ) : (
              <>
                <RotateCcw size={14} />
              </>
            )}
          </Button>
        </div>
      </section>

      <ScrollArea
        className={`flex max-h-[81vh] min-w-full flex-col !gap-2 overflow-hidden overflow-y-auto`}
      >
        {filteredEmailsBasedOnContacts &&
        filteredEmailsBasedOnContacts.length > 0
          ? filteredEmailsBasedOnContacts
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((email) => <EmailCard email={email} key={email.id} />)
          : null}
      </ScrollArea>
    </section>
  );
}
