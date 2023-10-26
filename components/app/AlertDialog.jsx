import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./../ui/alert-dialog";
import { useRecoilState } from "recoil";
import { alertDialog } from "../atoms/alertDialogAtom";

export default function AlertDialogDemo() {
  const [alertDialogAtom, setAlertDialogAtom] = useRecoilState(alertDialog);
  // console.log(alertDialogAtom);
  if (alertDialogAtom.show === false) {
    return null;
  }

  function cancelAlert() {
    setAlertDialogAtom({ show: false });
  }

  function confirmAlert() {
    setAlertDialogAtom({ show: false });
  }

  return (
    <AlertDialog open={alertDialogAtom.show}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            {alertDialogAtom.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-1xl text-black">
            {alertDialogAtom.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelAlert}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmAlert}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
