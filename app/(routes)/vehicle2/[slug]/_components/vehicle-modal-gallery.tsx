import { Button } from '@/components/ui/button'
import { X } from 'lucide-react';
import React from 'react'

interface VehicleModalGalleryProps {
    images: string[];
    modalCurrentSlide: number;
    closeModal: () => void;
}

export default function VehicleModalGallery({ images, modalCurrentSlide, closeModal }: VehicleModalGalleryProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#808080]">
              {/* Photo counter - positioned absolutely */}
              <span className="absolute top-6 left-6 z-20 bg-[#a6a6a6] text-white px-4 py-2 rounded-full backdrop-blur-sm">
                Photo {modalCurrentSlide + 1}/{images.length}
              </span>
    
              {/* Close Button - positioned absolutely */}
              <Button
                onClick={closeModal}
                variant="ghost"
                size="icon"
                className="absolute cursor-pointer top-6 right-6 z-20 bg-[#a6a6a6] hover:bg-[#a6a6a6] text-white rounded-lg h-10 w-10"
                aria-label="Close gallery"
              >
                <X className="h-5 w-5 text-white" />
              </Button>
    
              {/* Main scrollable container */}
              <div
                className="modal-scroll-container w-full h-full overflow-y-auto scroll-smooth snap-y snap-mandatory"
                style={{
                  width: "100vw",
                  height: "100vh",
                }}
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="snap-start flex items-center justify-center"
                    style={{
                      minHeight: "100vh",
                      width: "100vw",
                    }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <img
                        src={image}
                        alt={`Car image ${index + 1}`}
                        className="w-full h-full object-contain"
                        loading="eager"
                        style={{
                          maxWidth: "95vw",
                          maxHeight: "90vh",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
    
              {/* Click overlay to close */}
              <div
                className="absolute inset-0 -z-10 pointer-events-none"
                onClick={closeModal}
                aria-label="Close gallery"
              />
            </div>
  )
}
