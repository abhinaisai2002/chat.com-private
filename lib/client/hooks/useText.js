import React from 'react';

import lodash, { uniqueId } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { textDialog } from '@/components/atoms/textDialogAtom';

export function useText(draw) {
  const [squares, setSquares] = React.useState([]);
  const [drag, setDrag] = React.useState(false);
  const [currentSquare, setCurrentSquare] = React.useState({
    top: {},
    id: '',
    isDragging: false,
    transform: {
      scaleX: 1,
      scaleY: 1,
    },
    strokeColor: '',
    selected: false,
    text: '',
  });

  function confirm(text, color) {
    const allsquares = lodash.cloneDeep(squares);
    allsquares.push({
      top: {
        x: 100, y: 100,
      },
      id: uuidv4(),
      isDragging: false,
      transform: {
        scaleX: 1,
        scaleY: 1,
      },
      strokeColor: color,
      selected: false,
      text,
    });
    setSquares(allsquares);
  }

  const setTextDialogAtom = useSetRecoilState(textDialog);

  React.useEffect(() => {
    if (draw.action === 'type') {
      setTextDialogAtom({ show: true, confirmCallBack: confirm });
    }
  }, [JSON.stringify(draw)]);

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
    currSq.top.x = e.target.x();
    currSq.top.y = e.target.y();
    newSquares[currIndex] = currSq;
    setSquares(newSquares);
    setDrag(false);
  };

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

    handleDragStart,
    handleDragEnd,
    handleTransformEnd,
    setSelected,
    deleteSelected,
    setTexts: setSquares,
    deSelectTexts:deSelectSquares
  };
}
