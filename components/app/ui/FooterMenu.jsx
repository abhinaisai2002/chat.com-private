import { Button } from "@/components/ui/button";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

import { Minus, Plus } from "lucide-react";

export default function FooterMenu({ handleExport }) {
  return (
    <Menubar>
      <MenubarMenu className="">
        <MenubarTrigger onClick={handleExport}>Download</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
