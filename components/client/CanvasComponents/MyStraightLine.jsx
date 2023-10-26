const { useRecoilValue } = require("recoil");
import { drawAtom } from "@/atoms/drawAtom";
import React from "react";
import { Line, Transformer } from "react-konva";

export default function MyStraightLine(props) {
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
      <Line
        ref={ref}
        {...props}
        onClick={(e) => {
          if (draw.action === "") props.setSelected(e);
        }}
      />
      {props.isSelected && (
        <Transformer

          draggable={true}
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
