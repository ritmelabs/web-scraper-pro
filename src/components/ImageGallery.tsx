import { useState } from "react";
import { Image as ImageIcon, X, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type GalleryImage = { filename: string; source_url: string; size: number };

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<GalleryImage | null>(null);
  if (!images.length) return null;

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <ImageIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Image gallery</h3>
            <p className="text-xs text-muted-foreground">{images.length} images discovered · click to preview</p>
          </div>
        </div>
        <Badge variant="outline">{images.length}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {images.slice(0, 24).map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(img)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted transition-all hover:border-primary/60 hover:shadow-lg"
          >
            <img
              src={img.source_url}
              alt={img.filename}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.15"; }}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-1 left-1 right-1 truncate text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              {img.filename}
            </div>
          </button>
        ))}
      </div>
      {images.length > 24 && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          + {images.length - 24} more — sign in to view the full gallery
        </p>
      )}

      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-md animate-fade-in"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <button
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={active.source_url}
              alt={active.filename}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-full object-contain"
            />
            <div className="flex items-center justify-between gap-3 border-t border-border bg-card p-4">
              <div className="min-w-0">
                <div className="truncate font-mono text-xs">{active.filename}</div>
                <div className="text-xs text-muted-foreground">{(active.size / 1024).toFixed(1)} KB</div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={active.source_url} target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-3 w-3" /> Open</a>
                </Button>
                <Button asChild size="sm">
                  <a href={active.source_url} download={active.filename} target="_blank" rel="noreferrer"><Download className="mr-1 h-3 w-3" /> Download</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
