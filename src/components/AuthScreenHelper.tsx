import { ArrowRight, Book } from "lucide-react";

import Link from "next/link";
import React from "react";

type Props = {
  Icon?: React.ElementType;
  title?: string;
  description?: string;
  goto?: string;
};

const AuthScreenHelper = ({
  title = "fdsdfdsfsdf",
  description = "dsfsdfsdfsdfsdfsdfsdfsdfsdfsfsdfsdf",
  goto,
  Icon = Book,
}: Props) => {
  return (
    <div className="flex flex-col gap-2 text-sm">

    <Link
      href={goto || ""}
      className="flex items-center p-4 rounded-lg w-full max-w-md"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg ">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4 hover:underline text-white ">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-smtext-opacity-70">{description}</p>
      </div>
      <ArrowRight className="w-6 h-6 ml-9 text-white" />
    </Link>
    <hr className="mx-4 bg-white w-full h-[1px] opacity-20" />
    </div>
  );
};

export default AuthScreenHelper;
