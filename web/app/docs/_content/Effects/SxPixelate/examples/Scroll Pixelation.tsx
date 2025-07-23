"use client"

import ComponentPreview from "@/components/docTemplates/ComponentPreview"
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";
import { IoImage, IoShapes, IoVideocam } from "react-icons/io5";
import { ExtrudeSVG, Shadex, SxPixelate } from "shadex"
import { motion } from "motion/react";

function Demo({
  src,
  mesh,
  maxPixelSize = [40, 40],
}: {
  src?: string;
  mesh?: React.ReactNode;
  maxPixelSize?: [number, number];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pixelSize, setPixelSize] = useState<[number, number]>(maxPixelSize);

useEffect(() => {
  if (!containerRef.current) return;

  const el = containerRef.current;
  let animationFrame: number;

  function calculatePixelSize() {
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;

    const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
    const maxDistance = viewportHeight / 2 + rect.height / 2;

    const t = Math.min(distanceFromCenter / maxDistance, 1); // normalized [0,1]

    const sizeX = Math.max(1, maxPixelSize[0] * t);
    const sizeY = Math.max(1, maxPixelSize[1] * t);

    setPixelSize([sizeX, sizeY]);
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        function update() {
          calculatePixelSize();
          animationFrame = requestAnimationFrame(update);
        }
        update();
      } else {
        cancelAnimationFrame(animationFrame);
        setPixelSize(maxPixelSize);
      }
    },
    { root: null, threshold: 0 }
  );

  observer.observe(el);

  return () => {
    observer.disconnect();
    cancelAnimationFrame(animationFrame);
  };
}, [maxPixelSize]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Shadex
        className="w-full h-full"
        src={src}
        mesh={mesh}
        controls={!!mesh}
        videoOptions={{ muted: true }}
      >
        <SxPixelate pixelSize={pixelSize} monochrome dynamicPixelWidth/>
      </Shadex>
    </div>
  );
}

export default function ScrollPixelationDemo() {
  const [maxPixelSize, setMaxPixelSize] = useState<[number, number]>([40, 40]);
  const [mediaSource, setMediaSource] = useState<"image" | "video" | "mesh">("image");

  const media = {
    image: "cat.jpg",
    video: "cat_video.mp4",
    mesh: { 
      element: <ExtrudeSVG src="/next.svg" depth={10}/> as React.ReactNode & {text:string}, 
      text: `<ExtrudeSVG src="/next.svg" depth={10}/>` 
    }
  }

  return <main className="w-full aspect-[16/13]">
    <ComponentPreview id="ScrollPixelationDemo" title="ScrollPixelationDemo.tsx" codes={`import { Shadex, SxPixelate } from "shadex"
function ScrollPixelationDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pixelSize, setPixelSize] = useState<[number, number]>([${maxPixelSize.join(", ")}]);
  const maxPixelSize = [${maxPixelSize.join(", ")}];

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    let animationFrame: number;

    function calculatePixelSize() {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;

      const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
      const maxDistance = viewportHeight / 2 + rect.height / 2;

      const t = Math.min(distanceFromCenter / maxDistance, 1); // normalized [0,1]

      const sizeX = maxPixelSize[0] * t + 1;
      const sizeY = maxPixelSize[1] * t + 1;

      setPixelSize([sizeX, sizeY]);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          function update() {
            calculatePixelSize();
            animationFrame = requestAnimationFrame(update);
          }
          update();
        } else {
          cancelAnimationFrame(animationFrame);
          setPixelSize(maxPixelSize);
        }
      },
      { root: null, threshold: 0 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [maxPixelSize]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Shadex className="w-full h-full" ${mediaSource!=="mesh"?"src=\"/"+media[mediaSource]+"\"":"mesh={"+media.mesh.text+"}"} ${mediaSource=="mesh"?"controls":""}>
        <SxPixelate pixelSize={pixelSize} />
      </Shadex>
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 
      rounded text-xs text-white">
        Pixel Size: {pixelSize[0].toFixed(1)}
      </div>
    </div>
  );
}`}> 
      <div className="flex flex-col gap-2 items-center w-full h-full">
        <div className="w-full h-full">
          <Demo {...(mediaSource!=="mesh"?{src: "/"+media[mediaSource]}:{mesh: media.mesh.element})} maxPixelSize={maxPixelSize}/>
        </div>
        <div className="flex wrap gap-4 items-center p-2 bg-muted/20 w-[90%] mb-2 rounded-md">
          <div className=" text-sm text-muted-foreground flex flex-col gap-1">
            <div className="">Media</div>
            <div className="flex gap-2">
              <div className={`p-1 px-2 bg-muted/80 rounded-md cursor-pointer relative`} onClick={()=>setMediaSource("image")}>
                {mediaSource=="image" && <motion.div layoutId="mediaIndicator-ScrollPixelation" className="w-full h-full absolute bg-accent-foreground top-0 left-0 z-[1] rounded-md"/>}
                <IoImage className={`z-[2] relative ${mediaSource=="image"?"text-accent":""}`}/>
              </div>
              <div className={`p-1 px-2 bg-muted/80 rounded-md cursor-pointer relative`} onClick={()=>setMediaSource("video")}>
                {mediaSource=="video" && <motion.div layoutId="mediaIndicator-ScrollPixelation" className="w-full h-full absolute bg-accent-foreground top-0 left-0 z-[1] rounded-md"/>}
                <IoVideocam className={`z-[2] relative ${mediaSource=="video"?"text-accent":""}`}/>
              </div>
              <div className={`p-1 px-2 bg-muted/80 rounded-md cursor-pointer relative`} onClick={()=>setMediaSource("mesh")}>
                {mediaSource=="mesh" && <motion.div layoutId="mediaIndicator-ScrollPixelation" className="w-full h-full absolute bg-accent-foreground top-0 left-0 z-[1] rounded-md"/>}
                <IoShapes className={`z-[2] relative ${mediaSource=="mesh"?"text-accent":""}`}/>
              </div>
            </div>
          </div>
          <div className="w-full text-sm text-muted-foreground flex flex-col gap-1">
            <div className="">Max Pixel Size</div>
            <div className="flex gap-2">
              <div className="p-1 px-2 bg-muted/80 rounded-md">{maxPixelSize[0]}</div>
              <Slider min={1} max={100} step={1} value={[maxPixelSize[0]]} onValueChange={(value)=>setMaxPixelSize([value[0], value[0]])}/>
            </div>
          </div>
        </div>
      </div>
    </ComponentPreview>
  </main>
}
