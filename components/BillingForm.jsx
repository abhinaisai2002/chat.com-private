import { useMutation } from "@tanstack/react-query";
import MaxWidthWrapper from "./app/MaxWidthWrapper";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

const BillingForm = ({ subscriptionPlan }) => {
  const { toast } = useToast();

  const { mutate: createStripeSession, isPending } = useMutation({
    mutationKey: ["createstripesession"],
    mutationFn: () => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-session`
      );
    },
    onSuccess: (data) => {
      let { url } = data.data;
      if (url) window.location.href = url;
      if (!url) {
        toast({
          title: "There was a problem...",
          description: "Please try again in a moment",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
              plan.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit">
              {isPending ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}
              {subscriptionPlan.isSubscribed
                ? "Manage Subscription"
                : "Upgrade to PRO"}
            </Button>

            {subscriptionPlan.isSubscribed ? (
              <p className="rounded-full text-xs font-medium">
                {subscriptionPlan.isCanceled
                  ? "Your plan will be canceled on "
                  : "Your plan renews on"}
                {format(subscriptionPlan.stripeCurrentPeriodEnd, "dd.MM.yyyy")}.
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
