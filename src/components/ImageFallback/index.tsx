import Image from 'next/image';
import type { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface Props extends ImageProps {
  fallbackSrc: string;
}

const ImageFallback = ({ src, fallbackSrc, alt, ...rest }: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          // Broken image
          setImgSrc(fallbackSrc);
        }
      }}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    ></Image>
  );
};

export default ImageFallback;
