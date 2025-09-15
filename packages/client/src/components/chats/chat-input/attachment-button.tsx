import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const AttachmentButton = () => {
  // Mock uploads with progress values
  const [uploads, setUploads] = useState([
    {
      id: 1,
      type: "image",
      url: "https://picsum.photos/400/225?random=1",
      progress: 25,
    },
    {
      id: 2,
      type: "image",
      url: "https://picsum.photos/400/225?random=2",
      progress: 60,
    },
    { id: 3, type: "video", url: "/your-video.mp4", progress: 90 },
  ]);

  return (
    <>
      <Button variant={"outline"} size={"icon"}>
        <Plus />
      </Button>

      <div className="absolute w-full h-28 -top-[300%] p-2 flex gap-2 items-center overflow-x-auto">
        {/* {uploads.map((file) => (
          <div
            key={file.id}
            className="relative w-40 aspect-video overflow-hidden rounded-md"
          >
            {file.type === "image" ? (
              <img
                src={file.url}
                alt="upload preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <video
                src={file.url}
                controls
                className="h-full w-full object-cover"
              />
            )}
            {file.progress < 100 && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
                <div
                  className="h-1 bg-primary transition-all"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            )}
            <button className="absolute top-0 right-0 border-2 border-white rounded-full">
              <X size={14} />
            </button>
          </div>
        ))} */}
      </div>
    </>
  );
};

export default AttachmentButton;
