import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Baseline,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Minus,
  MousePointer,
  Move,
  MoveUpRight,
  PencilLine,
  Square,
} from "lucide-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { mouseCursorAtom } from "@/atoms/mouseIconAtom";
import { HexColorPicker } from "react-colorful";
import { drawAtom } from "@/atoms/drawAtom";
import { Slider } from "@/components/ui/slider";

const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export const YourComponent = () => {
  const [draw, setDrawAtom] = useRecoilState(drawAtom);

  function handleChange(e) {
    setDrawAtom((p) => ({ ...p, color: e }));
  }
  // console.log(draw);
  return (
    <HexColorPicker
      className="w-full"
      color={draw.color}
      onChange={handleChange}
    />
  );
};

const DefaultContent = ({ action }) => {
  const [draw, setDrawAtom] = useRecoilState(drawAtom);

  function handleChange(e) {
    setDrawAtom((p) => ({ ...p, width: e[0] - "0" }));
  }
  return (
    <div className="flex pr-4 w-[660px]">
      <ul className=" p-4  w-[360px]">
        <li className="w-full">
          <YourComponent />
        </li>
      </ul>
      <div className="py-4 h-full w-[300px]">
        <ul className="py-2 px-1">
          <li>
            <strong className="text-1xl">Width</strong>
            <Slider
              onValueChange={handleChange}
              className="w-full"
              defaultValue={[draw.width]}
              max={10}
              step={1}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

const headings = [
  {
    icon: <MousePointer />,
    title: "mouse",
    mouseCursorName: "default",
    content: () => <></>,
    action: "",
  },
  {
    icon: <Hand />,
    title: "hand",
    content: () => <></>,
    mouseCursorName: "cursor-grab",
    action: "hand",
  },
  {
    icon: <Square />,
    title: "square",
    content: DefaultContent,
    mouseCursorName: "cursor-crosshair",
    action: "square",
  },
  {
    icon: <Diamond />,
    title: "diamond",
    content: DefaultContent,
    mouseCursorName: "cursor-crosshair",
    action: "diamond",
  },
  {
    icon: <Circle />,
    title: "circle",
    content: DefaultContent,
    mouseCursorName: "cursor-crosshair",
    action: "circle",
  },
  {
    icon: <MoveUpRight />,
    title: "moveupright",
    content: DefaultContent,
    mouseCursorName: "cursor-crosshair",
    action: "arrow-head",
  },
  {
    icon: <Minus />,
    title: "minus",
    content: DefaultContent,
    mouseCursorName: "cursor-crosshair",
    action: "arrow",
  },
  {
    icon: <PencilLine />,
    title: "pencilline",
    content: DefaultContent,
    mouseCursorName: "cursor-crosshair",
    action: "line",
  },
  {
    icon: <Baseline />,
    title: "baseline",
    content: () => <></>,
    mouseCursorName: "cursor-crosshair",
    action: "type",
  },
  {
    icon: <Eraser />,
    title: "eraser",
    content: () => <></>,
    mouseCursorName: "cursor-eraser",
    action: "eraser",
  },
];

export default function NavBar() {
  const setMouseCursorAtom = useSetRecoilState(mouseCursorAtom);
  const [draw, setDrawAtom] = useRecoilState(drawAtom);
  const [selected, setSelected] = React.useState(draw.action === "" && "mouse");

  function setMouseCursor(mouseCursorName) {
    setMouseCursorAtom(mouseCursorName);
  }

  function setDraw(action) {
    if (action === "eraser") {
      setDrawAtom({ color: "#ffffff", width: 10, action: "line" });
    } else
      setDrawAtom((p) => {
        return { ...p, action: action };
      });
  }

  return (
    <>
      <NavigationMenu className="border-2 border-accent rounded-lg shadow-xl bg-white">
        <NavigationMenuList className="p-2">
          {headings.map(({ content: Component, ...heading }) => (
            <NavigationMenuItem id="tool" key={heading.title}>
              <NavigationMenuTrigger
                className={heading.title === selected && "bg-black text-white"}
                onClick={() => {
                  setSelected(heading.title);
                  setMouseCursor(heading.mouseCursorName);
                  setDraw(heading.action);
                }}
              >
                {heading.icon}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="block">
                <Component action="line" />
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {/* {defaultContent} */}
    </>
  );
}
