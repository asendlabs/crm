"use client";
import React, { useContext } from "react";
import { AccountContext } from "../../contexts/account-context";

export function Header() {
  const { account } = useContext(AccountContext);
  return <>{account?.accountName}</>;
}
