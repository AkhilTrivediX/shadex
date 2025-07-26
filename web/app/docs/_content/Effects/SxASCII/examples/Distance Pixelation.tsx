"use client"

import ComponentPreview from "@/components/docTemplates/ComponentPreview"
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";
import { IoImage, IoShapes, IoVideocam } from "react-icons/io5";
import { ExtrudeSVG, Shadex, SxASCII } from "shadex"
import { motion } from "motion/react";
import { FaHandPointer } from "react-icons/fa";

function Demo({
  src,
  mesh,
  radius = 200,
  maxPixelSize = 40,
}: {
  src?: string;
  mesh?: React.ReactNode;
  radius?: number;
  maxPixelSize?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pixelSize, setPixelSize] = useState<number>(maxPixelSize);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const t = distance < (Math.min(50, radius / 4)) ? 0 : Math.min(distance / radius, 1);
      const size = maxPixelSize * t + 5;

      setPixelSize(size);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [radius, maxPixelSize]);

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
      <div className="w-[100px] h-[100px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col gap-2 bg-black/40 rounded-xl items-center justify-center" style={{ opacity: 1 - (maxPixelSize - pixelSize) / maxPixelSize }}>
        <FaHandPointer /> Bring Mouse Closer
      </div>
    </div>
  );
}

export default function DistanceASCIIDemo() {
  const [maxPixelSize, setMaxPixelSize] = useState<number>(40);
  const [radius, setRadius] = useState(500);
  const [mediaSource, setMediaSource] = useState<"image" | "video" | "mesh">("image");

  const media = {
    image: "cat.jpg",
    video: "cat_video.mp4",
    mesh: {
      element: <ExtrudeSVG src="/next.svg" depth={10} /> as React.ReactNode & { text: string },
      text: `<ExtrudeSVG src="/next.svg" depth={10}/>`
    }
  }

  return (
    <main className="w-full aspect-[16/13]">
      <ComponentPreview id="DistanceASCIIDemo" title="ASCIIDemo.tsx" codes={`import { Shadex, SxASCII } from "shadex"

function DistanceASCIIDemo(){
  const containerRef = useRef<HTMLDivElement>(null);
  const [pixelSize, setPixelSize] = useState<number>(40);
  const radius = ${radius};
  const maxPixelSize = ${maxPixelSize};

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const t = distance < (Math.min(50, radius / 4)) ? 0 : Math.min(distance / radius, 1);
      const size = maxPixelSize * t + 5;

      setPixelSize(size);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Shadex className="w-full h-full" ${mediaSource !== "mesh" ? `src="/${media[mediaSource]}"` : `mesh={${media.mesh.text}}`} ${mediaSource === "mesh" ? `controls` : ``}>
        <SxASCII pixelSize={pixelSize} />
      </Shadex>
    </div>
  );
}
`}>
        <div className="flex flex-col gap-2 items-center w-full h-full">
          <div className="w-full h-full">
            <Demo {...(mediaSource !== "mesh" ? { src: "/" + media[mediaSource] } : { mesh: media.mesh.element })} maxPixelSize={maxPixelSize} radius={radius} />
          </div>
          <div className="flex wrap gap-4 items-center p-2 bg-muted/20 w-[90%] mb-2 rounded-md">
            <div className="text-sm text-muted-foreground flex flex-col gap-1">
              <div>Media</div>
              <div className="flex gap-2">
                {(["image", "video", "mesh"] as const).map((type) => (
                  <div key={type} className={`p-1 px-2 bg-muted/80 rounded-md cursor-pointer relative`} onClick={() => setMediaSource(type)}>
                    {mediaSource === type && <motion.div layoutId="mediaIndicator-DistancePixelation" className="w-full h-full absolute bg-accent-foreground top-0 left-0 z-[1] rounded-md" />}
                    {type === "image" && <IoImage className={`z-[2] relative ${mediaSource === "image" ? "text-accent" : ""}`} />}
                    {type === "video" && <IoVideocam className={`z-[2] relative ${mediaSource === "video" ? "text-accent" : ""}`} />}
                    {type === "mesh" && <IoShapes className={`z-[2] relative ${mediaSource === "mesh" ? "text-accent" : ""}`} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full text-sm text-muted-foreground flex flex-col gap-1">
              <div>Max Pixel Size</div>
              <div className="flex gap-2">
                <div className="p-1 px-2 bg-muted/80 rounded-md">{maxPixelSize}</div>
                <Slider min={5} max={100} step={1} value={[maxPixelSize]} onValueChange={(value) => setMaxPixelSize(value[0])} />
              </div>
            </div>

            <div className="w-full text-sm text-muted-foreground flex flex-col gap-1">
              <div>Radius</div>
              <div className="flex gap-2">
                <div className="p-1 px-2 bg-muted/80 rounded-md">{radius}</div>
                <Slider min={50} max={1000} step={10} value={[radius]} onValueChange={(value) => setRadius(value[0])} />
              </div>
            </div>
          </div>
        </div>
      </ComponentPreview>
    </main>
  );
}
