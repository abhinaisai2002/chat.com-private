import { drawAtom } from "@/atoms/drawAtom";
import React from "react";
import { Rect, Text, Transformer } from "react-konva";
import { useRecoilValue } from "recoil";

export default function MyText(props) {
  const ref = React.useRef();
  const trRef = React.useRef();
  const draw = useRecoilValue(drawAtom);

  React.useEffect(() => {
    if (props.isSelected) {
      trRef.current.nodes([ref.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [props.isSelected]);

  return (
    <>
      <Text
        ref={ref}
        {...props}
        fill={props.stroke}
        fontSize={32}
        onClick={(e) => {
          if (draw.action === "") props.setSelected(e);
        }}
      />
      {props.isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
