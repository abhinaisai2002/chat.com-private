import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRecoilState } from "recoil";
import { textDialog } from "../atoms/textDialogAtom";
import { Textarea } from "../ui/textarea";
import { drawAtom } from "@/atoms/drawAtom";
import { HexColorPicker } from "react-colorful";
import React from "react";

export function DialogDemo() {
  const [textDialogAtom, setTextDialogAtom] = useRecoilState(textDialog);

  const [text, setText] = React.useState("");
  const [color, setColor] = React.useState("black");

  function confirmAlert() {
    // setTextDialogAtom({ show: false });
    textDialogAtom.confirmCallBack(text, color);
    setTextDialogAtom({ show: false });
  }

  if (textDialogAtom.show === false) {
    return <></>;
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(e) => {
        if (!e) {
          setTextDialogAtom({ show: false });
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Text</DialogTitle>
          <DialogDescription>
            Make changes to your text here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text" className="text-right">
              Text
            </Label>
            <Textarea
              id="text"
              className="col-span-3"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Color
            </Label>
            <HexColorPicker
              className="col-span-3"
              color={color}
              onChange={setColor}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={confirmAlert}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
