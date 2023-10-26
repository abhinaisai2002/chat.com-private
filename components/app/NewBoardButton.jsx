import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import createBoard from "@/lib/backend-api/createBoard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, Plus } from "lucide-react";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { alertDialog } from "../atoms/alertDialogAtom";
import Link from "next/link";

export default function NewBoardButton() {
  const [showModal, setShowModal] = React.useState();

  const queryClient = useQueryClient();

  const [alert, setAlert] = React.useState(false);

  const [progressCount, setProgressCount] = React.useState(0);

  const interval = React.useRef();

  const toast = useToast();

  const startSimulatedProgress = () => {
    setProgressCount(0);

    const interval = setInterval(() => {
      setProgressCount((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  const newBoardMutation = useMutation({
    mutationKey: ["create", "user", "board"],
    mutationFn: () => {
      return axios(`${process.env.NEXT_PUBLIC_API_URL}/api/board/create`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "boards"]);
      toast.toast({
        title: "New Board was created successfully",
      });
      clearInterval(interval.current);
      setShowModal(false);
    },
    onError: (error) => {
      setShowModal(false);
      clearInterval(interval.current);
      // console.log(error.response.data.message);
      setAlert(true);
    },
  });

  function handleClick() {
    setShowModal(true);

    interval.current = startSimulatedProgress();

    newBoardMutation.mutate();
  }

  return (
    <>
      <Button onClick={handleClick}>
        New board
        <Plus></Plus>
      </Button>

      <Dialog open={showModal} defaultOpen={false} onOpenChange={(e) => {}}>
        <DialogContent>
          <div className="text-center">
            <h1 className="text-2xl">Creating a board for you</h1>
          </div>
          <div className="mx-auto w-full px-2 h-24 bg-gray-200 flex justify-center items-center">
            <div className="px-4 w-full">
              <div className="w-full flex justify-center my-4">
                <p>Please wait we are creating a board for you.</p>
              </div>
              <div className="w-full mt-4 mb-4">
                <Progress value={progressCount} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {alert && (
        <Dialog open={alert} onOpenChange={(e) => setAlert(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Max boards reached.</DialogTitle>
              <DialogDescription>
                You have reached the limit of creating boards. Checkout the
                <Link
                  href={`${process.env.NEXT_PUBLIC_API_URL}/#pricing`}
                  className={buttonVariants({
                    variant: "link",
                    className: "px-0 mx-1",
                  })}
                >
                  pricing
                </Link>
                plans and
                <Link
                  href={`${process.env.NEXT_PUBLIC_API_URL}/billing`}
                  className={buttonVariants({
                    variant: "link",
                    className: "px-0 mx-1",
                  })}
                >
                  billing
                </Link>
                dashboard.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setAlert(false)} type="buttom">
                Continue.
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
