import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <h1 className="text-4xl font-bold mb-4">Welcome to RealEstate Listing Viewer</h1>
      <Button className="px-4 py-2 rounded">
        Get Started
      </Button>
    </div>
  );
}