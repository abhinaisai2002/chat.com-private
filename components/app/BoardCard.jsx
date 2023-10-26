import { format } from "date-fns";
import { Loader2, Plus, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";

export default function BoardCard({ name, date, board }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const deleteBoardMutation = useMutation({
    mutationKey: ["delete", "board"],
    mutationFn: (boardId) => {
      // console.log(boardId);
      return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/board/delete`, {
        boardId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "boards"]);
      toast.toast({
        title: "Board was delete successfully",
      });
    },
  });
  // // console.log(board);
  return (
    <li className="px-3 border border-black py-6 rounded-2xl">
      <Link href={`/board/${board.id}`} target="_blank">
        <div className="flex flex-row justify-start items-center">
          <div className="ml-5 w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <div className="ml-4  truncate ">{name}</div>
        </div>
        <div></div>
      </Link>
      <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2 w-24 ml-6">
          <Plus className="h-4 w-4" />
          {format(new Date(date), "dd MMM yyyy")}
        </div>
        <Button
          onClick={() => {
            deleteBoardMutation.mutate(board.id);
          }}
          size="sm"
          className="w-full ml-4"
          variant="destructive"
        >
          {deleteBoardMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </div>
    </li>
  );
}
