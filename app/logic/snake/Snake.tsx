'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const tileWidth = 50;
interface snakeNode{
    x: number,
    y: number,
    tail: snakeNode | null
}
type Direction = 'N' | 'S' | 'W' | 'E';

export function SnakeCanvas(){
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const intervalGameloopId = useRef<NodeJS.Timeout | null>(null);
    const fps = 1;
    const [headNode] = useState(createNode(100, 100));
    const [direction] = useState<Direction>('N');
    let counter = 1;

    const gameLoop = useCallback(() => {        
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.clearRect(0,0, canvas.width, canvas.height);
                drawTiles(ctx, canvas.width, canvas.height, 'gray');
                drawSnake(ctx, headNode);
                moveSnake(direction, headNode);
                counter++;
            }
        }
    }, [canvasRef, headNode, direction]);

    useEffect(() => {
        if (canvasRef.current){
            headNode.tail = createNode(100,150);
            intervalGameloopId.current = setInterval(gameLoop, 1000/fps);
        }
        return () => {
            if (intervalGameloopId.current) {
                clearInterval(intervalGameloopId.current);
            }
        };
    }, [gameLoop, fps]);

    return (
        <div>
            <canvas ref={canvasRef} width={400} height={400} className='bg-muted'>
            </canvas>            
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
function createNode(x: number, y: number): snakeNode{
    return {
        x: x,
        y: y,
        tail: null
    }
}
function moveSnake(direction: Direction, headNode: snakeNode) {
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
    //head prev coords
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
export default SnakeCanvas;
