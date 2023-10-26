import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingNav({ session }) {
  return (
    <nav className="sticky h-14 inset-x-0 z-30 w-full bottom-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>Chat.com</span>
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            <Link
              href="/#pricing"
              className={buttonVariants({
                variant: "link",
                size: "lg",
                className: "px-2",
              })}
            >
              Check Pricing
            </Link>

            {session.status === "authenticated" ? (
              <Link
                href="/boards"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "px-2",
                })}
              >
                Boards
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "px-2",
                })}
              >
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
