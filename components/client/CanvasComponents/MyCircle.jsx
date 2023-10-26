import { drawAtom } from "@/atoms/drawAtom";
import React from "react";
import { Ellipse, Transformer } from "react-konva";
import { useRecoilValue } from "recoil";

export default function MyCircle(props) {
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
      <Ellipse
        ref={ref}
        {...props}
        onClick={(e) => {
          // console.log(draw);
          if (draw.action === "") props.setSelected(e);
        }}
      />
      {props.isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            // // console.log(oldBox, newBox);
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
