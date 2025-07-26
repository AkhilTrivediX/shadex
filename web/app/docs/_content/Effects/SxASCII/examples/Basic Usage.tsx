"use client"

import ComponentPreview from "@/components/docTemplates/ComponentPreview"
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { IoImage, IoShapes, IoVideocam } from "react-icons/io5";
import { ExtrudeSVG, Shadex, SxASCII } from "shadex";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/animate-ui/base/switch";

function Demo({
  pixelSize,
  asciiChars,
  src,
  mesh,
  showBlocks
}: {
  pixelSize: number;
  asciiChars: string;
  src?: string;
  mesh?: React.ReactNode;
  showBlocks?: boolean;
}) {
  return (
    <Shadex
      className="w-full h-full"
      src={src}
      mesh={mesh}
      controls={!!mesh}
      videoOptions={{ muted: true }}
    >
      <SxASCII pixelSize={pixelSize} asciiChars={asciiChars} minLuma={0.0001} maxLuma={1} showBlocks={showBlocks}/>
    </Shadex>
  );
}

export default function ASCIIUsageExample() {
  const [pixelSize, setPixelSize] = useState<number>(20);
  const [asciiChars, setAsciiChars] = useState<string>(".:-=+*#%@");
  const [mediaSource, setMediaSource] = useState<"image" | "video" | "mesh">(
    "image"
  );
  const [showBlocks, setShowBlocks] = useState<boolean>(false);

  const media = {
    image: "cat.jpg",
    video: "cat_video.mp4",
    mesh: {
      element: <ExtrudeSVG src="/next.svg" depth={10} /> as React.ReactNode & {
        text: string;
      },
      text: `<ExtrudeSVG src="/next.svg" depth={10}/>`,
    },
  };

  return (
    <main className="w-full aspect-[16/13]">
      <ComponentPreview
        id="ASCIIUsageDemo"
        title="ASCIIDemo.tsx"
        codes={`import { Shadex, SxASCII } from "shadex"
function ASCIIDemo(){
  return (
    <Shadex className="w-[500px] h-[350px]" ${
      mediaSource !== "mesh"
        ? 'src="/' + media[mediaSource] + '"'
        : "mesh={" + media.mesh.text + "}"
    } ${mediaSource == "mesh" ? "controls" : ""}>
      <SxASCII pixelSize={${pixelSize}} asciiChars="${asciiChars}" ${showBlocks && "showBlocks"}/>
    </Shadex>)
}`}
      >
        <div className="flex flex-col gap-2 items-center w-full h-full">
          <div className="w-full h-full">
            <Demo
              pixelSize={pixelSize}
              showBlocks={showBlocks}
              asciiChars={asciiChars}
              {...(mediaSource !== "mesh"
                ? { src: "/" + media[mediaSource] }
                : { mesh: media.mesh.element })}
            />
          </div>
          <div className="flex wrap gap-4 items-center p-2 bg-muted/20 w-[90%] mb-2 rounded-md">
            <div className=" text-sm text-muted-foreground flex flex-col gap-1">
              <div className="">Media</div>
              <div className="flex gap-2">
                <div
                  className={`p-1 px-2 bg-muted/80 rounded-md cursor-pointer relative`}
                  onClick={() => setMediaSource("image")}
                >
                  {mediaSource == "image" && (
                    <motion.div
                      layoutId="mediaIndicator-ASCIIUsageDemo"
                      className="w-full h-full absolute bg-accent-foreground top-0 left-0 z-[1] rounded-md"
                    />
                  )}
                  <IoImage
                    className={`z-[2] relative ${
                      mediaSource == "image" ? "text-accent" : ""
                    }`}
                  />
                </div>
                <div
                  className={`p-1 px-2 bg-muted/80 rounded-md cursor-pointer relative`}
                  onClick={() => setMediaSource("video")}
                >
                  {mediaSource == "video" && (
                    <motion.div
                      layoutId="mediaIndicator-ASCIIUsageDemo"
                      className="w-full h-full absolute bg-accent-foreground top-0 left-0 z-[1] rounded-md"
                    />
                  )}
                  <IoVideocam
                    className={`z-[2] relative ${
                      mediaSource == "video" ? "text-accent" : ""
                    }`}
                  />
                </div>
                <div
                  className={`p-1 px-2 bg-muted/80 rounded-md cursor-pointer relative`}
                  onClick={() => setMediaSource("mesh")}
                >
                  {mediaSource == "mesh" && (
                    <motion.div
                      layoutId="mediaIndicator-ASCIIUsageDemo"
                      className="w-full h-full absolute bg-accent-foreground top-0 left-0 z-[1] rounded-md"
                    />
                  )}
                  <IoShapes
                    className={`z-[2] relative ${
                      mediaSource == "mesh" ? "text-accent" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            <div className="w-full text-sm text-muted-foreground flex flex-col gap-1">
              <div className="">Pixel Size</div>
              <div className="flex gap-2">
                <div className="p-1 px-2 bg-muted/80 rounded-md">
                  {pixelSize}
                </div>
                <Slider
                  min={2}
                  max={64}
                  step={1}
                  value={[pixelSize]}
                  onValueChange={(value) => setPixelSize(value[0])}
                />
              </div>
            </div>
            <div className="w-full text-sm text-muted-foreground flex flex-col gap-1">
              <div className="">ASCII Characters</div>
              <Input
                value={asciiChars}
                onChange={(e) => setAsciiChars(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="w-full text-sm text-muted-foreground flex flex-col gap-1">
                <div className="">Show Blocks</div>
                <div className="flex gap-2">
                    <Switch checked={showBlocks} onCheckedChange={setShowBlocks}/>
                </div>
            </div>
          </div>
        </div>
      </ComponentPreview>
    </main>
  );
}
