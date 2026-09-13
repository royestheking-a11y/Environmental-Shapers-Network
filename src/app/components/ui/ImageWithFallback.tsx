import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function optimizeImageUrl(url: string | undefined, targetWidth?: number): string | undefined {
  if (!url || typeof url !== 'string') return url;
  
  // Optimize Unsplash images for WebP/AVIF auto-format and compressed payload
  if (url.includes('images.unsplash.com')) {
    try {
      const u = new URL(url);
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      u.searchParams.set('q', '70');
      
      const maxW = targetWidth || 900;
      const currentW = u.searchParams.has('w') ? Number(u.searchParams.get('w')) : 1200;
      if (currentW > maxW) {
        u.searchParams.set('w', String(maxW));
      }
      return u.toString();
    } catch {
      return url;
    }
  }
  return url;
}

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
  targetWidth?: number
}

export function ImageWithFallback({
  src,
  alt = '',
  style,
  className,
  fallbackSrc,
  targetWidth,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const optimizedSrc = optimizeImageUrl(src, targetWidth)

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img
          src={fallbackSrc || ERROR_IMG_SRC}
          alt={alt || 'Fallback image'}
          className="max-h-full max-w-full object-contain opacity-50"
        />
      </div>
    </div>
  ) : (
    <img
      src={optimizedSrc}
      alt={alt}
      className={`${className ?? ''} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-80'}`}
      style={style}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      onLoad={handleLoad}
      {...rest}
    />
  )
}

export default ImageWithFallback
