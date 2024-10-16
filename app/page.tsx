'use client';
import { Button } from "./components/Button";
import SnakeCanvas from "./logic/snake/Snake";

export default function Home() {
  return (
    <>
      <div id="header">
      </div>
      <div id="main">
        <Button
          value="Buy"/>
        <SnakeCanvas/>
      </div>
      <div id="footer">
      </div>
    </>
  );
}
