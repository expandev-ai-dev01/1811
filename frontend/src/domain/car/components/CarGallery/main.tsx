import { useState } from 'react';
import { cn } from '@/core/lib/utils';
import { Button } from '@/core/components/button';
import { Maximize2, X } from 'lucide-react';

interface CarGalleryProps {
  photos: Array<{ url: string; legenda?: string }>;
  mainPhoto: string;
}

export const CarGallery = ({ photos, mainPhoto }: CarGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState(mainPhoto);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Ensure main photo is in the list if not already
  const allPhotos = photos.some((p) => p.url === mainPhoto)
    ? photos
    : [{ url: mainPhoto, legenda: 'Foto Principal' }, ...photos];

  const handleThumbnailClick = (url: string) => {
    setSelectedPhoto(url);
  };

  const toggleLightbox = () => {
    setIsLightboxOpen(!isLightboxOpen);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted group">
        <img
          src={selectedPhoto}
          alt="Veículo"
          className="h-full w-full object-cover transition-transform duration-300"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={toggleLightbox}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
        {allPhotos.map((photo, index) => (
          <button
            key={index}
            className={cn(
              'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all snap-start',
              selectedPhoto === photo.url
                ? 'border-primary-600 ring-2 ring-primary-600/20'
                : 'border-transparent opacity-70 hover:opacity-100'
            )}
            onClick={() => handleThumbnailClick(photo.url)}
          >
            <img
              src={photo.url}
              alt={photo.legenda || `Foto ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Simple Lightbox Overlay */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={toggleLightbox}
          >
            <X className="h-6 w-6" />
          </Button>
          <img
            src={selectedPhoto}
            alt="Ampliada"
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  );
};
