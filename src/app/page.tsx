import { ResizableJsonTool } from "@/components/resizable-json-tool";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <ResizableJsonTool />
    </main>
  );
}
