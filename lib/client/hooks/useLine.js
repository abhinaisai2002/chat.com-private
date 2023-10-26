import React from 'react';

import lodash, { uniqueId } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export function useLine(draw) {
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      {
        points: [pos.x, pos.y],
        color: draw.color,
        width: draw.width,
      },
    ]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    // console.log("hi")
    isDrawing.current = false;
  };

  return {
    lines,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setLines,
  };
}
