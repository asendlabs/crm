"use client";
import React, { useContext } from "react";
import { AccountContext } from "../../contexts/account-context";

export function Header() {
  const { account } = useContext(AccountContext);
  return <div className="flex flex-col p-4"></div>;
}
