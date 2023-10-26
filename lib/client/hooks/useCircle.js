import React, { useState, useEffect } from 'react';

import lodash, { uniqueId } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export function useCircle(draw) {
  const [circles, setCircles] = useState([]);
  const [drag, setDrag] = useState(false);
  const [currentCircle, setCurrentCircle] = useState({
    top: {},
    bottom: {},
    id: '',
    draw: false,
    isDragging: false,
    transform: {
      scaleX: 1,
      scaleY: 1,
    },
    selected: false,
    strokeColor: '',
    strokeWidth: 0,
  });

  useEffect(() => {
    if (currentCircle.draw) {
      const allcircles = lodash.cloneDeep(circles);
      const currCircleIndex = allcircles.findIndex(
        (sq) => sq.id === currentCircle.id,
      );
      if (currCircleIndex === -1) {
        allcircles.push(currentCircle);
        setCircles(allcircles);
        return;
      }
      const currSquare = allcircles[currCircleIndex];
      currSquare.bottom.x = currentCircle.bottom.x;
      currSquare.bottom.y = currentCircle.bottom.y;
      allcircles[currCircleIndex] = currSquare;
      setCircles(allcircles);
    }
  }, [JSON.stringify(currentCircle)]);

  function handleMouseDown(e) {
    const newState = lodash.cloneDeep(currentCircle);
    const pos = e.target.getStage().getPointerPosition();
    newState.top.x = pos.x;
    newState.top.y = pos.y;
    newState.bottom.x = pos.x;
    newState.bottom.y = pos.y;
    newState.id = uuidv4();

    newState.strokeWidth = draw.width;
    newState.strokeColor = draw.color;

    newState.draw = true;
    setCurrentCircle(newState);
    setDrag(true);
  }

  function handleMouseMove(e) {
    if (!drag) return;

    const pos = e.target.getStage().getPointerPosition();
    const newState = lodash.cloneDeep(currentCircle);
    newState.bottom.x = pos.x;
    newState.bottom.y = pos.y;
    setCurrentCircle(newState);
  }

  function handleMouseUp(e) {
    setDrag(false);
  }

  const handleDragStart = (e) => {
    const { id } = e.target.attrs;
    const newCircles = lodash.cloneDeep(circles);
    const currIndex = newCircles.findIndex((circle) => circle.id == id);
    const currCircle = newCircles[currIndex];
    currCircle.isDragging = true;
    newCircles[currIndex] = currCircle;
    setCircles(newCircles);
    setDrag(true);
  };

  const handleDragEnd = (e) => {
    const { id } = e.target.attrs;
    const newCircles = lodash.cloneDeep(circles);
    const currIndex = newCircles.findIndex((cr) => cr.id == id);
    const currCircle = newCircles[currIndex];
    currCircle.isDragging = false;
    const width = currCircle.bottom.x - currCircle.top.x;
    const height = currCircle.bottom.y - currCircle.top.y;
    const radiusX = Math.abs(
      Math.floor((currCircle.bottom.x - currCircle.top.x) / 2),
    );
    const raduisY = Math.abs(
      Math.floor((currCircle.bottom.y - currCircle.top.y) / 2),
    );
    const topX = e.target.x() - radiusX;
    const topY = e.target.y() - raduisY;
    currCircle.top.x = topX;
    currCircle.top.y = topY;
    currCircle.bottom.x = width + topX;
    currCircle.bottom.y = height + topY;
    newCircles[currIndex] = currCircle;
    setCircles(newCircles);
    setDrag(false);
  };

  function handleTransformEnd(e) {
    const { scaleX } = e.target.attrs;
    const { scaleY } = e.target.attrs;
    const { id } = e.target.attrs;
    const newCircles = lodash.cloneDeep(circles);
    const currIndex = newCircles.findIndex((cr) => cr.id == id);
    const currCr = newCircles[currIndex];
    currCr.transform.scaleX = scaleX;
    currCr.transform.scaleY = scaleY;
    newCircles[currIndex] = currCr;
    setCircles(newCircles);
  }

  function handleDelete(id) {
    const newSquares = lodash.cloneDeep(circles);
    setCircles(newSquares.filter((sq) => sq.id !== id));
  }

  function setSelected(e) {
    const { id } = e.target.attrs;
    const newSquares = lodash.cloneDeep(circles);
    const currIndex = newSquares.findIndex((sq) => sq.id == id);
    const currSq = newSquares[currIndex];
    currSq.selected = !currSq.selected;
    newSquares[currIndex] = currSq;
    setCircles(newSquares);
  }

  function deleteSelected() {
    const newSquares = lodash.cloneDeep(circles);
    setCircles(newSquares.filter((sq) => !sq.selected));
  }

  function deSelectCircles() {
    const newSquares = lodash.cloneDeep(circles);
    setCircles(newSquares.map((sq) => {
      sq.selected = false;
      return sq;
    }));
  }

  return {
    circles,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDragStart,
    handleDragEnd,
    handleTransformEnd,
    handleDelete,
    setSelected,
    deleteSelected,
    setCircles,
    deSelectCircles
  };
}
