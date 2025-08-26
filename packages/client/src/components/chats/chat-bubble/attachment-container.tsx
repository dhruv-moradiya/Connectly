import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ATTACHMENTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const AttachmentContainer = () => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-1 mb-1">
        {ATTACHMENTS.length > 3 &&
          ATTACHMENTS.slice(0, 3).map((_attachment, index) => (
            <div
              key={index}
              className="w-full min-w-20 h-20 rounded-md cursor-pointer overflow-hidden"
              onClick={() => setIsImageDialogOpen(true)}
            >
              <img
                src="https://static1.polygonimages.com/wordpress/wp-content/uploads/2025/03/Demon-Slayer_-Kimetsu-no-Yaiba-Infinity-Castle-Theatrical-Date-Poster-US.jpg?q=49&fit=crop&w=1140&dpr=2"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        <div
          className="cursor-pointer w-full h-20 rounded-md flex items-center justify-center bg-black/20 text-white text-sm font-medium"
          onClick={() => setIsImageDialogOpen(true)}
        >
          +{ATTACHMENTS.length - 3}
        </div>
      </div>
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent
          className={cn(
            "w-full max-w-6xl min-h-[85vh] p-0 overflow-hidden flex items-center justify-center transition-all duration-300"
          )}
        >
          <Carousel className="w-full h-full relative flex items-center justify-center">
            <CarouselContent className="h-full">
              {ATTACHMENTS.length > 0 &&
                ATTACHMENTS.map((_attachment, index) => (
                  <CarouselItem
                    key={index}
                    className="flex items-center justify-center select-none h-full"
                  >
                    <img
                      src="https://static1.polygonimages.com/wordpress/wp-content/uploads/2025/03/Demon-Slayer_-Kimetsu-no-Yaiba-Infinity-Castle-Theatrical-Date-Poster-US.jpg?q=49&fit=crop&w=1140&dpr=2"
                      alt="Preview"
                      className="max-h-[80vh] w-auto object-contain rounded-lg shadow-lg animate-fadeIn"
                    />
                  </CarouselItem>
                ))}
            </CarouselContent>

            {/* Floating nav buttons */}
            <CarouselPrevious className="absolute left-2 sm:left-4 rounded-full p-2 sm:p-3 shadow-md transition-all" />
            <CarouselNext className="absolute right-2 sm:right-4 rounded-full p-2 sm:p-3 shadow-md transition-all" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(AttachmentContainer);
