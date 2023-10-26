import React from 'react';

import lodash, { uniqueId } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export function useArrowLine(draw) {
  const [squares, setSquares] = React.useState([]);
  const [drag, setDrag] = React.useState(false);
  const [currentSquare, setCurrentSquare] = React.useState({
    top: {},
    bottom: {},
    id: '',
    draw: false,
    transform: {
      scaleX: 1,
      scaleY: 1,
    },
    selected: false,
    width: 0,
    height: 0,
    strokeColor: '',
    strokeWidth: 0,
  });

  React.useEffect(() => {
    if (currentSquare.draw) {
      const allsquares = lodash.cloneDeep(squares);
      const currSquareIndex = allsquares.findIndex(
        (sq) => sq.id === currentSquare.id,
      );
      if (currSquareIndex === -1) {
        allsquares.push(currentSquare);
        setSquares(allsquares);
        return;
      }
      const currSquare = allsquares[currSquareIndex];
      currSquare.bottom.x = currentSquare.bottom.x;
      currSquare.bottom.y = currentSquare.bottom.y;
      allsquares[currSquareIndex] = currSquare;
      setSquares(allsquares);
    }
  }, [JSON.stringify(currentSquare)]);

  function handleMouseDown(e) {
    const newState = lodash.cloneDeep(currentSquare);
    const pos = e.target.getStage().getPointerPosition();
    newState.top.x = pos.x;
    newState.top.y = pos.y;
    newState.bottom.x = pos.x;
    newState.bottom.y = pos.y;
    newState.id = uuidv4();

    newState.strokeWidth = draw.width;
    newState.strokeColor = draw.color;

    newState.draw = true;
    setCurrentSquare(newState);
    setDrag(true);
  }

  function handleMouseMove(e) {
    if (!drag) return;

    const pos = e.target.getStage().getPointerPosition();
    const newState = lodash.cloneDeep(currentSquare);
    newState.bottom.x = pos.x;
    newState.bottom.y = pos.y;
    newState.width = newState.bottom.x - newState.top.x;
    newState.height = newState.bottom.y - newState.top.y;
    setCurrentSquare(newState);
  }

  function handleMouseUp(e) {
    setDrag(false);
  }

  function handleTransformEnd(e) {
    const { scaleX } = e.target.attrs;
    const { scaleY } = e.target.attrs;
    const { id } = e.target.attrs;
    const newSquares = lodash.cloneDeep(squares);
    const currIndex = newSquares.findIndex((sq) => sq.id == id);
    const currSq = newSquares[currIndex];
    currSq.transform.scaleX = scaleX;
    currSq.transform.scaleY = scaleY;
    newSquares[currIndex] = currSq;
    setSquares(newSquares);
  }

  function handleDelete(id) {
    const newSquares = lodash.cloneDeep(squares);
    setSquares(newSquares.filter((sq) => sq.id !== id));
  }

  function setSelected(e) {
    const { id } = e.target.attrs;
    const newSquares = lodash.cloneDeep(squares);
    const currIndex = newSquares.findIndex((sq) => sq.id == id);
    const currSq = newSquares[currIndex];
    currSq.selected = !currSq.selected;
    newSquares[currIndex] = currSq;
    setSquares(newSquares);
  }

  function deleteSelected() {
    const newSquares = lodash.cloneDeep(squares);
    setSquares(newSquares.filter((sq) => !sq.selected));
  }

  function deSelectArrows() {
    const newSquares = lodash.cloneDeep(squares);
    setSquares(newSquares.map((sq) => {
      sq.selected = false;
      return sq;
    }));
  }

  return {
    squares,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTransformEnd,
    handleDelete,
    setSelected,
    deleteSelected,
    setArrowLines: setSquares,
    deSelectArrows
  };
}
