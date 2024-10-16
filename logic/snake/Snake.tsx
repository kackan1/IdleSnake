'use client';
import { Button } from '@/app/components/Button';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const tileWidth = 50;
interface snakeNode{
    x: number,
    y: number,
    tail: snakeNode | null
}
type Direction = 'N' | 'S' | 'W' | 'E';

export function SnakeCanvas({
    canvasWidth, 
    canvasHeight
}:{
    canvasWidth: number,
    canvasHeight: number
}){
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const intervalGameloopId = useRef<NodeJS.Timeout | null>(null);
    const fps = 2;
    const [headNode, setHeadNode] = useState<snakeNode>({x: 250,y: 250,tail: null});
    const [direction, setDirection] = useState<Direction>('N');
    const [growing, setGrowing] = useState<boolean>(false);
    const [endRound, setEndRound] = useState<boolean>(false);
    function handleDirectionChange(value: Direction){
        setDirection(value);
    }

    const gameLoop = useCallback(() => {        
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.clearRect(0,0, canvas.width, canvas.height);
                moveSnake(direction, headNode, growing);
                if(collisionCheck(headNode, canvasWidth, canvasHeight)){
                    setEndRound(true);
                };
                growSnake(headNode, setHeadNode, setGrowing);
                drawTiles(ctx, canvas.width, canvas.height, 'gray');
                drawSnake(ctx, headNode);
            }
        }
    }, [canvasRef, headNode, direction, growing]);

    useEffect(() => {
        if (!endRound){
            if (canvasRef.current){
                intervalGameloopId.current = setInterval(gameLoop, 1000/fps);
            }
            return () => {
                if (intervalGameloopId.current) {
                    clearInterval(intervalGameloopId.current);
                }
            };
        } else {
            // addPoints();
        }
    }, [gameLoop, fps, endRound]);

    return (
        <div>
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className='bg-muted'>
            </canvas>
            <Button
            value='N'
            onClick={() => handleDirectionChange('N')}
            />
            <Button
            value='S'
            onClick={() => handleDirectionChange('S')}
            />
            <Button
            value='W'
            onClick={() => handleDirectionChange('W')}
            />
            <Button
            value='E'
            onClick={() => handleDirectionChange('E')}
            />    
        </div>
    );
};

function drawNode(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: string){
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
}
function drawTiles(ctx: CanvasRenderingContext2D, width: number, height: number, fill: string){
    ctx.fillStyle = fill;
    for (let x = 0; x < width/tileWidth; x++) {
        for(let y = 0; y < height/tileWidth; y++) {
            ctx.fillRect(1+50*x, 1+50*y, tileWidth-2, tileWidth-2)
        }
    }
}
function drawSnake(ctx: CanvasRenderingContext2D, headNode: snakeNode){
    let currentNode: snakeNode | null = headNode;
    while (currentNode !== null ) {
        drawNode(ctx, currentNode.x, currentNode.y, tileWidth, tileWidth, 15, 'green');
        currentNode = currentNode.tail;
    }
}
function growSnake(headNode: snakeNode, setHeadNode: React.Dispatch<React.SetStateAction<snakeNode>>, setGrowing: React.Dispatch<React.SetStateAction<boolean>>){
    setGrowing(true);
    let newHead: snakeNode = {x: headNode.x, y: headNode.y, tail: headNode}
    setHeadNode(newHead);
}
function moveSnake(direction: Direction, headNode: snakeNode, growing: boolean) {
    let currentNode: snakeNode | null = {...headNode}; 
    switch (direction) {
        case 'N':
            headNode.y -= tileWidth;
            break;
        case 'S':
            headNode.y += tileWidth;
            break;
        case 'W':
            headNode.x -= tileWidth;
            break;
        case 'E':
            headNode.x += tileWidth;
            break;
    }
    if (!growing){
        let prevX = currentNode.x;
        let prevY = currentNode.y;
        currentNode = currentNode.tail;
        while (currentNode !== null){
            const tmpx = currentNode.x;
            const tmpy = currentNode.y;
            currentNode.x = prevX;
            currentNode.y = prevY;
            prevX = tmpx;
            prevY = tmpy;
            currentNode = currentNode.tail;
        }  
    }
}
function collisionCheck({...headNode}: snakeNode, canvasWidth: number, canvasHeight: number): boolean{
    let result = false;
    if (headNode.x < 0) result = true;
    if (headNode.x >= canvasWidth) result = true;
    if (headNode.y < 0) result = true;
    if (headNode.y >= canvasHeight) result = true;
    let tmpNode: snakeNode | null = headNode.tail;
    while (tmpNode !== null){
        if (headNode.x == tmpNode.x && headNode.y == tmpNode.y){
            result = true;
        } else {
            tmpNode = tmpNode.tail;
        }
    }
    return result;
}
export default SnakeCanvas;
