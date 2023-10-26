import { drawAtom } from "@/atoms/drawAtom";
import React, { useEffect, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { useRecoilValue } from "recoil";

import { useLine } from "@/lib/client/hooks/useLine";
import { useSquare } from "@/lib/client/hooks/useSquare";
import { useCircle } from "@/lib/client/hooks/useCircle";
import { useStraightLine } from "@/lib/client/hooks/useStraighLine";
import { useArrowLine } from "@/lib/client/hooks/useArrowLine";
import MyCircle from "./CanvasComponents/MyCircle";
import KeyboardEventHandler from "react-keyboard-event-handler";
import MyArrowLine from "./CanvasComponents/MyArrowLine";
import MyRect from "./CanvasComponents/MyRect";
import MyStraightLine from "./CanvasComponents/MyStraightLine";
import MyRhombus from "./CustomComponents/MyRhombus";
import { useRhombus } from "@/lib/client/hooks/useRhombus";
import { Html, Portal } from "react-konva-utils";
import MyText from "./CanvasComponents/MyText";
import { useText } from "@/lib/client/hooks/useText";
import FooterMenu from "../app/ui/FooterMenu";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

export default function Canvas({ boardId, ...props }) {
  const draw = useRecoilValue(drawAtom);
  const router = useRouter();
  const {
    lines,
    handleMouseDown: handleLineDown,
    handleMouseUp: handleLineUp,
    handleMouseMove: handleLineMove,
    setLines,
  } = useLine(draw);

  const {
    squares,
    handleMouseDown: handleSquareDown,
    handleMouseUp: handleSquareUp,
    handleMouseMove: handleSquareMove,
    handleDragStart: handleSquareDragStart,
    handleDragEnd: handleSqaureDragEnd,
    handleTransformEnd: handleSquareTransformEnd,
    setSelected: setSquareSelected,
    deleteSelected: deleteSquareSelected,
    setSquares,
    deSelectSquares,
  } = useSquare(draw);

  const {
    squares: texts,
    handleDragStart: handleTextDragStart,
    handleDragEnd: handleTextDragEnd,
    handleTransformEnd: handleTextTransformEnd,
    setSelected: setTextSelected,
    deleteSelected: deleteTextSelected,
    setTexts,
    deSelectTexts,
  } = useText(draw);

  const {
    squares: rhombuses,
    handleMouseDown: handleRhombusDown,
    handleMouseUp: handleRhombusUp,
    handleMouseMove: handleRhombusMove,
    handleDragStart: handleRhombusDragStart,
    handleDragEnd: handleRhombusDragEnd,
    handleTransformEnd: handleRhombusTransformEnd,
    setSelected: setRhombusSelected,
    deleteSelected: deleteRhombusSelected,
    setRhombuses,
    deSelectRhombuses,
  } = useRhombus(draw);

  const {
    circles,
    handleMouseDown: handleCircleDown,
    handleMouseUp: handleCircleUp,
    handleMouseMove: handleCircleMove,
    handleDragStart: handleCircleDragStart,
    handleDragEnd: handleCircleDragEnd,
    handleTransformEnd: handleCircleTransformEnd,
    setSelected: setCircleSelected,
    deleteSelected: deleteCircleSelected,
    setCircles,
    deSelectCircles,
  } = useCircle(draw);

  const {
    squares: straightlines,
    handleMouseDown: handleStraightLineDown,
    handleMouseUp: handleStraightLineUp,
    handleMouseMove: handleStraightLineMove,
    handleTransformEnd: handleStraightLineTransformEnd,
    setSelected: setStraightLineSelected,
    deleteSelected: deleteStraightLineSelected,
    setStraightLines,
    deSelectLines,
  } = useStraightLine(draw);

  const {
    squares: arrows,
    handleMouseDown: handleArrowDown,
    handleMouseUp: handleArrowUp,
    handleMouseMove: handleArrowMove,
    handleDelete: handleArrowLineDelete,
    setSelected: setArrowLineSelected,
    deleteSelected: deleteArrowLineSelected,
    setArrowLines,
    deSelectArrows,
  } = useArrowLine(draw);

  // // console.log(texts);

  function handleMouseDown(e) {
    if (draw.action === "line") {
      handleLineDown(e);
    } else if (draw.action === "square") {
      // const pos = e.target.getStage().getPointerPosition();
      // // console.log(pos);
      handleSquareDown(e);
    } else if (draw.action === "circle") {
      handleCircleDown(e);
    } else if (draw.action === "arrow") {
      handleStraightLineDown(e);
    } else if (draw.action === "arrow-head") {
      handleArrowDown(e);
    } else if (draw.action === "diamond") {
      handleRhombusDown(e);
    } else if (draw.action === "eraser") {
      handleEraserDown(e);
    }
  }
  function handleMouseMove(e) {
    if (draw.action === "line") {
      handleLineMove(e);
    } else if (draw.action === "square") {
      handleSquareMove(e);
    } else if (draw.action === "circle") {
      handleCircleMove(e);
    } else if (draw.action === "arrow") {
      handleStraightLineMove(e);
    } else if (draw.action === "arrow-head") {
      handleArrowMove(e);
    } else if (draw.action === "diamond") {
      handleRhombusMove(e);
    } else if (draw.action === "eraser") {
      handleEraserMove(e);
    }
  }
  function handleMouseUp(e) {
    if (draw.action === "line") {
      handleLineUp(e);
    } else if (draw.action === "square") {
      handleSquareUp(e);
    } else if (draw.action === "circle") {
      handleCircleUp(e);
    } else if (draw.action === "arrow") {
      handleStraightLineUp(e);
    } else if (draw.action === "arrow-head") {
      handleArrowUp(e);
    } else if (draw.action === "diamond") {
      handleRhombusUp(e);
    } else if (draw.action === "eraser") {
      handleEraserUp(e);
    }
  }

  React.useEffect(() => {
    deSelectArrows();
    deSelectSquares();
    deSelectTexts();
    deSelectRhombuses();
    deSelectCircles();
    deSelectLines();
  }, [draw.action]);

  function handleKeyDown(e) {
    deleteArrowLineSelected();
    deleteStraightLineSelected();
    deleteCircleSelected();
    deleteSquareSelected();
    deleteRhombusSelected();
    deleteTextSelected();
  }

  const stageRef = React.useRef();

  const boardDetailsQuery = useQuery({
    queryKey: ["board", "details"],
    queryFn: () => {
      return axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/board/${boardId}`
      );
    },
    enabled: boardId != null,
  });
  React.useEffect(() => {
    if (boardDetailsQuery.isError) {
      router.replace("/boards");
    }
  }, [boardDetailsQuery.isError]);

  const toast = useToast();

  const updateBoardMutation = useMutation({
    mutationKey: ["board", "details", "update"],
    mutationFn: (boardDetails) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/board/update`,
        boardDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onMutate: () => {
      toast.toast({
        title: "Saving data to the cloud...",
      });
    },
    onSuccess: () => {
      toast.toast({
        title: "Saved data to the cloud",
      });
    },
    onError: () => {
      toast.toast({
        title: "Saved data to the cloud failed",
      });
    },
  });

  function updateData() {
    if (boardDetailsQuery.isSuccess && !boardDetailsQuery.isError) {
      updateBoardMutation.mutate({
        boardId,
        lines,
        squares,
        texts,
        rhombuses,
        circles,
        arrows,
        straightlines,
      });
    }
  }

  React.useEffect(() => {
    if (boardDetailsQuery.isSuccess) {
      const {
        lines,
        squares,
        texts,
        rhombuses,
        circles,
        arrows,
        strightlines: straightlines,
      } = boardDetailsQuery.data.data.boardDetails;
      setLines(lines);
      setSquares(squares);
      setTexts(texts);
      setRhombuses(rhombuses);
      setCircles(circles);
      setArrowLines(arrows);
      setStraightLines(straightlines);
    }
  }, [boardDetailsQuery.isSuccess]);

  React.useEffect(() => {
    let timer = setTimeout(() => {
      updateData();
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    JSON.stringify(lines),
    JSON.stringify(squares),
    JSON.stringify(texts),
    JSON.stringify(rhombuses),
    JSON.stringify(circles),
    JSON.stringify(straightlines),
    JSON.stringify(arrows),
  ]);

  const handleExport = () => {
    const node = stageRef.current;
    var image = node.toImage({
      callback(image) {
        // do stuff with img
        const link = document.createElement("a");
        link.href = image.src;
        // console.log(image.src);
        // Set the download attribute to specify the file name
        link.download = "downloaded_image.jpg";
        // Trigger a click event on the anchor to initiate the download
        link.click();
        // Clean up: remove the temporary anchor element
        link.remove();
      },
    });
  };

  // // console.log(lines);

  return (
    <div>
      <KeyboardEventHandler
        handleKeys={["delete"]}
        onKeyEvent={handleKeyDown}
      />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        className={cn(props.className, "bg-white")}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.width}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          <Portal>
            {squares.length > 0 &&
              squares.map((sq) => {
                return (
                  <MyRect
                    key={sq.id}
                    id={sq.id}
                    x={sq.top.x}
                    y={sq.top.y}
                    width={sq.bottom.x - sq.top.x}
                    height={sq.bottom.y - sq.top.y}
                    scaleX={sq.transform.scaleX}
                    scaleY={sq.transform.scaleY}
                    stroke={sq.strokeColor}
                    strokeWidth={sq.strokeWidth}
                    fill={sq.isDragging ? "#c2bebe" : "transparent"}
                    draggable={draw.action === "hand"}
                    onDragStart={handleSquareDragStart}
                    onDragEnd={handleSqaureDragEnd}
                    onTransformEnd={handleSquareTransformEnd}
                    setSelected={setSquareSelected}
                    isSelected={sq.selected}
                  />
                );
              })}
            {texts.length > 0 &&
              texts.map((sq) => {
                return (
                  <MyText
                    key={sq.id}
                    id={sq.id}
                    x={sq.top.x}
                    y={sq.top.y}
                    scaleX={sq.transform.scaleX}
                    scaleY={sq.transform.scaleY}
                    stroke={sq.strokeColor}
                    fill={sq.isDragging ? "#c2bebe" : "transparent"}
                    draggable={draw.action === "hand"}
                    onDragStart={handleTextDragStart}
                    onDragEnd={handleTextDragEnd}
                    onTransformEnd={handleTextTransformEnd}
                    setSelected={setTextSelected}
                    isSelected={sq.selected}
                    text={sq.text}
                  />
                );
              })}
            {rhombuses.length > 0 &&
              rhombuses.map((sq) => {
                return (
                  <MyRhombus
                    key={sq.id}
                    id={sq.id}
                    x={sq.top.x}
                    y={sq.top.y}
                    width={sq.bottom.x - sq.top.x}
                    height={sq.bottom.y - sq.top.y}
                    scaleX={sq.transform.scaleX}
                    scaleY={sq.transform.scaleY}
                    stroke={sq.strokeColor}
                    strokeWidth={sq.strokeWidth}
                    fill={sq.isDragging ? "#c2bebe" : "transparent"}
                    draggable={draw.action === "hand"}
                    onDragStart={handleRhombusDragStart}
                    onDragEnd={handleRhombusDragEnd}
                    onTransformEnd={handleRhombusTransformEnd}
                    setSelected={setRhombusSelected}
                    isSelected={sq.selected}
                  />
                );
              })}
            {circles.length > 0 &&
              circles.map((circle) => {
                return (
                  <MyCircle
                    id={circle.id}
                    key={circle.id}
                    x={Math.floor((circle.bottom.x + circle.top.x) / 2)}
                    y={Math.floor((circle.bottom.y + circle.top.y) / 2)}
                    radiusX={Math.abs(
                      Math.floor((circle.bottom.x - circle.top.x) / 2)
                    )}
                    radiusY={Math.abs(
                      Math.floor((circle.bottom.y - circle.top.y) / 2)
                    )}
                    stroke={circle.strokeColor}
                    strokeWidth={circle.strokeWidth}
                    fill={circle.isDragging ? "#c2bebe" : "transparent"}
                    draggable={draw.action === "hand"}
                    onDragStart={handleCircleDragStart}
                    onDragEnd={handleCircleDragEnd}
                    scaleX={circle.transform.scaleX}
                    scaleY={circle.transform.scaleY}
                    onTransformEnd={handleCircleTransformEnd}
                    setSelected={setCircleSelected}
                    isSelected={circle.selected}
                  />
                );
              })}
            {straightlines.length > 0 &&
              straightlines.map((line) => {
                return (
                  <MyStraightLine
                    key={line.id}
                    points={[
                      line.top.x,
                      line.top.y,
                      line.bottom.x,
                      line.bottom.y,
                    ]}
                    fill={line.strokeColor}
                    id={line.id}
                    width={line.strokeWidth}
                    stroke={line.strokeColor}
                    scaleX={line.transform.scaleX}
                    scaleY={line.transform.scaleY}
                    onTransformEnd={handleStraightLineTransformEnd}
                    setSelected={setStraightLineSelected}
                    isSelected={line.selected}
                  />
                );
              })}
            {arrows.length > 0 &&
              arrows.map((line) => {
                return (
                  <MyArrowLine
                    key={line.id}
                    points={[
                      line.top.x,
                      line.top.y,
                      line.bottom.x,
                      line.bottom.y,
                    ]}
                    id={line.id}
                    pointerLength={10}
                    pointerWidth={10}
                    fill={line.strokeColor}
                    width={line.strokeWidth}
                    stroke={line.strokeColor}
                    scaleX={line.transform.scaleX}
                    scaleY={line.transform.scaleY}
                    onDelete={handleArrowLineDelete}
                    setSelected={setArrowLineSelected}
                    isSelected={line.selected}
                  />
                );
              })}
          </Portal>
        </Layer>
      </Stage>
      {/* <App /> */}
      <div className="absolute bottom-4 left-6">
        <FooterMenu handleExport={handleExport} />
      </div>
    </div>
  );
}
