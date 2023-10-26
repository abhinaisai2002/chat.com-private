import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "./button";
import MaxWidthWrapper from "../app/MaxWidthWrapper";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function navbar() {
  return (
    <MaxWidthWrapper>
      <div className="border-gray-400 border-b-2 py-2 flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                href={"/"}
                className={cn(
                  buttonVariants({
                    variant: "link",
                  }),
                  "text-2xl hover:bg-transparent hover:cursor-pointer"
                )}
              >
                Chat.com
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex  justify-between">
          <Button onClick={() => signOut()}>Logout</Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
