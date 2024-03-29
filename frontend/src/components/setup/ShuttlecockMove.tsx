import React, { useEffect, useRef, useState } from "react";
import SvgShuttlecock from "./SvgShuttlecock";
import {
  motion,
  useAnimate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import useAnimateStore, { Step } from "@/store/useAnimateStore";
import { useScreen, useElementSize } from "usehooks-ts";
import { Concert_One, M_PLUS_1, Yomogi } from "next/font/google";

// const path = "M 239 17 C 142 17 48.5 103 48.5 213.5 C 48.5 324 126 408 244 408 C 362 408 412 319 412 213.5 C 412 108 334 68.5 244 68.5 C 154 68.5 102.68 135.079 99 213.5 C 95.32 291.921 157 350 231 345.5 C 305 341 357.5 290 357.5 219.5 C 357.5 149 314 121 244 121 C 174 121 151.5 167 151.5 213.5 C 151.5 260 176 286.5 224.5 286.5 C 273 286.5 296.5 253 296.5 218.5 C 296.5 184 270 177 244 177 C 218 177 197 198 197 218.5 C 197 239 206 250.5 225.5 250.5 C 245 250.5 253 242 253 218.5"

// const path = " M0.5 21.5C198.5 -13 475.5 -48.3 1000 1000";

// const transition = { duration: 4, yoyo: Infinity, ease: "easeOut" };

type StepObject = {
  [K in Step]: string;
};

type Points = {
  x: number;
  y: number;
};

const shadowColor = [
  "drop-shadow(0.1px 0.2px 0.2px rgb(20 21 23 / 0.9))",
  "drop-shadow(8px 16px 16px rgb(20 21 23 / 0.5))",
  "drop-shadow(8px 16px 16px rgb(20 21 23 / 0.5))",
  "drop-shadow(0.1px 0.2px 0.2px rgb(20 21 23 / 0.9))",
];

const moveScale = [45, 54, 54, 45];

export default function ShuttlecockMove() {
  const [currentPage, currentStep, setCurrentStep] = useAnimateStore(
    (store) => [store.currentPage, store.currentStep, store.setCurrentStep],
  );
  const [showShuttlecock, setShowShuttlecock] = useState(false);
  const [path, setPath] = useState("");
  const progress = useMotionValue(0);
  const [scope, animate] = useAnimate();
  const offest = useTransform(progress, [0, 1], ["0%", "100%"]);

  const move = useMotionValue(0);
  const shadow = useTransform(move, [0, 0.4, 0.65, 1], shadowColor);
  const scale = useTransform(move, [0, 0.4, 0.65, 1], moveScale);
  const yOffset = useMotionValue(0);
  const [divRef, size] = useElementSize();
  const screen = useScreen();
  const svgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentStep === "name") {
      setShowShuttlecock(true);
    }
  }, [currentStep]);

  useEffect(() => {
    const generatePath = (width: number, screenHeight: number) => {
      const points: string[] = [];
      const height = screenHeight * 5;
      const curveCtrl = screenHeight * 0.5;
      let currPoint: Points = { x: 0, y: 0 };

      const curve = (startC: Points, endC: Points, newPoint: Points) => {
        const ret = `C\
          ${currPoint.x + startC.x} ${currPoint.y + startC.y} \
          ${newPoint.x + endC.x} ${newPoint.y + endC.y} \
          ${newPoint.x} ${newPoint.y}\
        `;

        currPoint = newPoint;
        return ret;
      };

      points.push(
        `M${currPoint.x} ${currPoint.y} ${curve(
          { x: 0, y: screenHeight * 0.8 },
          { x: 0, y: -curveCtrl },
          { x: width * 0.85, y: height * 0.36 },
        )}`,
      );

      points.push(
        curve(
          { x: 0, y: +curveCtrl },
          { x: 0, y: -curveCtrl },
          { x: width * 0.15, y: height * 0.56 },
        ),
      );

      points.push(
        curve(
          { x: 0, y: +curveCtrl },
          { x: 0, y: -curveCtrl },
          { x: width * 0.85, y: height * 0.76 },
        ),
      );

      points.push(
        curve(
          { x: 0, y: +curveCtrl },
          { x: 0, y: -curveCtrl },
          { x: width * 0.4, y: height },
        ),
      );

      return points.join(" ");
    };

    if (size && screen) setPath(generatePath(size.width, screen.height));
  }, [size, screen]);

  useEffect(() => {
    if (screen) {
      if (currentStep === "name") {
        progress.jump(0);
        animate([
          [progress, 0.14, { duration: 3.5 }],
          [yOffset, -screen.height * 0.4, { duration: 3.5, at: "<" }],
        ]);
      }
      if (currentStep === "avatar")
        animate([
          [progress, 0.4, { duration: 3 }],
          [yOffset, -screen.height * 1.725, { duration: 3, at: "<" }],
        ]);
      if (currentStep === "tfa")
        animate([
          [progress, 0.63, { duration: 3 }],
          [yOffset, -screen.height * 2.725, { duration: 3, at: "<" }],
        ]);
      if (currentStep === "end") {
        const animation = animate([
          [progress, 1, { duration: 3 }],
          [yOffset, -screen.height * 4.5, { duration: 3, at: "<" }],
          [yOffset, -screen.height * 4.5 + 500, { duration: 1.2, at: 3 }],
        ]);
        animation.then(() => setShowShuttlecock(false));
      }
      move.jump(0);
      animate(move, 1, { duration: 3 });
    }
  }, [currentStep]);

  return (
    <>
      {showShuttlecock && (
        <motion.div
          className="h-screen w-screen absolute top-0 left-0 overflow-hidden"
          ref={divRef}
        >
          <motion.div className="absolute top-0 left-0" style={{ y: yOffset }}>
            <motion.div
              ref={svgRef}
              className="absolute top-0 left-0 -rotate-[135deg]"
              style={{
                offsetPath: `path("${path}")`,
                offsetDistance: offest,
              }}
            >
              <SvgShuttlecock
                width={scale}
                height={scale}
                style={{ filter: shadow }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
