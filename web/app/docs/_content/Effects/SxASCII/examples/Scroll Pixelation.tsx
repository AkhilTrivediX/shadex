"use client";

import ComponentPreview from "@/components/docTemplates/ComponentPreview";
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";
import { IoImage, IoShapes, IoVideocam } from "react-icons/io5";
import { ExtrudeSVG, Shadex, SxASCII } from "shadex";
import { motion } from "motion/react";

function Demo({
  src,
  mesh,
  maxPixelSize = 40,
}: {
  src?: string;
  mesh?: React.ReactNode;
  maxPixelSize?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pixelSize, setPixelSize] = useState(maxPixelSize);

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

      const t = Math.min(distanceFromCenter / maxDistance, 1);

      const size = Math.max(10, maxPixelSize * t);
      setPixelSize(size);
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
        <SxASCII pixelSize={pixelSize} showBlocks/>
      </Shadex>
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white">
        Pixel Size: {pixelSize.toFixed(1)}
      </div>
    </div>
  );
}

export default function ScrollASCIIDemo() {
  const [maxPixelSize, setMaxPixelSize] = useState(40);
  const [mediaSource, setMediaSource] = useState<"image" | "video" | "mesh">("image");

  const media = {
    image: "cat.jpg",
    video: "cat_video.mp4",
    mesh: {
      element: <ExtrudeSVG src="/next.svg" depth={10} /> as React.ReactNode & { text: string },
      text: `<ExtrudeSVG src="/next.svg" depth={10}/>`
    }
  };

  return (
    <main className="w-full aspect-[16/13]">
      <ComponentPreview id="ScrollASCIIDemo" title="ScrollASCIIDemo.tsx" codes={`"use client";
import { Shadex, SxASCII } from "shadex"
function Demo(){
  const maxPixelSize = ${maxPixelSize};
  const containerRef = useRef<HTMLDivElement>(null);
  const [pixelSize, setPixelSize] = useState(maxPixelSize);

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

      const t = Math.min(distanceFromCenter / maxDistance, 1);

      const size = Math.max(10, maxPixelSize * t);
      setPixelSize(size);
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
        <SxASCII pixelSize={pixelSize} showBlocks/>
      </Shadex>
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white">
        Pixel Size: {pixelSize.toFixed(1)}
      </div>
    </div>
  );
}`}>

        <div className="flex flex-col gap-2 items-center w-full h-full">
          <div className="w-full h-full">
            <Demo
              {...(mediaSource !== "mesh"
                ? { src: "/" + media[mediaSource] }
                : { mesh: media.mesh.element })}
              maxPixelSize={maxPixelSize}
            />
          </div>
          <div className="flex wrap gap-4 items-center p-2 bg-muted/20 w-[90%] mb-2 rounded-md">
            <div className="text-sm text-muted-foreground flex flex-col gap-1">
              <div className="">Media</div>
              <div className="flex gap-2">
                {(["image", "video", "mesh"] as const).map((type) => (
                  <div
                    key={type}
                    className={`p-1 px-2 bg-muted/80 rounded-md cursor-pointer relative`}
                    onClick={() => setMediaSource(type)}
                  >
                    {mediaSource === type && (
                      <motion.div
                        layoutId="mediaIndicator-ScrollASCII"
                        className="w-full h-full absolute bg-accent-foreground top-0 left-0 z-[1] rounded-md"
                      />
                    )}
                    {{
                      image: <IoImage />,
                      video: <IoVideocam />,
                      mesh: <IoShapes />
                    }[type]}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full text-sm text-muted-foreground flex flex-col gap-1">
              <div className="">Max Pixel Size</div>
              <div className="flex gap-2">
                <div className="p-1 px-2 bg-muted/80 rounded-md">{maxPixelSize}</div>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={[maxPixelSize]}
                  onValueChange={(value) => setMaxPixelSize(value[0])}
                />
              </div>
            </div>
          </div>
        </div>

      </ComponentPreview>
    </main>
  );
}
