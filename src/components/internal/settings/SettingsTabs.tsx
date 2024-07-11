import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AccountForm from "@/components/internal/settings/AccountForm";
import React from "react";

const SettingsTabs = ({user}: {user: any}) => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="defaults">Defaults</TabsTrigger>
        <TabsTrigger value="communication">Communication</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="pt-6 pl-4">
        <AccountForm user={user} />
      </TabsContent>
      <TabsContent value="password">password form.tsx</TabsContent>
      <TabsContent value="billing">Billing form.tsx</TabsContent>
      <TabsContent value="defaults">Defaults form.tsx</TabsContent>
      <TabsContent value="communication">Communication form.tsx</TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
