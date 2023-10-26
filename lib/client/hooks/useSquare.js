import React from 'react';

import lodash, { uniqueId } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export function useSquare(draw) {
  const [squares, setSquares] = React.useState([]);
  const [drag, setDrag] = React.useState(false);
  const [currentSquare, setCurrentSquare] = React.useState({
    top: {},
    bottom: {},
    id: '',
    draw: false,
    isDragging: false,
    transform: {
      scaleX: 1,
      scaleY: 1,
    },
    strokeColor: '',
    strokeWidth: 0,
    selected: false,
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
    setCurrentSquare(newState);
  }

  function handleMouseUp(e) {
    setDrag(false);
  }

  const handleDragStart = (e) => {
    const { id } = e.target.attrs;
    const newSquares = lodash.cloneDeep(squares);
    const currIndex = newSquares.findIndex((sq) => sq.id == id);
    const currSq = newSquares[currIndex];
    currSq.isDragging = true;
    newSquares[currIndex] = currSq;
    setSquares(newSquares);
    setDrag(true);
  };
  const handleDragEnd = (e) => {
    const { id } = e.target.attrs;
    const newSquares = lodash.cloneDeep(squares);
    const currIndex = newSquares.findIndex((sq) => sq.id == id);
    const currSq = newSquares[currIndex];
    currSq.isDragging = false;
    const width = currSq.bottom.x - currSq.top.x;
    const height = currSq.bottom.y - currSq.top.y;
    currSq.top.x = e.target.x();
    currSq.top.y = e.target.y();
    currSq.bottom.x = width + e.target.x();
    currSq.bottom.y = height + e.target.y();
    newSquares[currIndex] = currSq;
    setSquares(newSquares);
    setDrag(false);
  };

  // const handleClick = (e) => {
  //   const id = e.target.attrs.id;
  //   const newSquares = lodash.cloneDeep(squares);
  //   let currIndex = newSquares.findIndex((sq) => sq.id == id);
  //   const currSq = newSquares[currIndex];
  //   currSq.isSelected = !currSq.isSelected;
  //   newSquares[currIndex] = currSq;
  //   setSquares(newSquares);
  // };

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

  function deSelectSquares() {
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
    handleDragStart,
    handleDragEnd,
    handleTransformEnd,
    setSelected,
    deleteSelected,
    setSquares,
    deSelectSquares
  };
}
