import React from 'react';
import { useImage } from 'react-image';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function ImageLoader({ src, alt, ...props }) {
    const { src: loadedSrc, isLoading, isError } = useImage({
      srcList: src,
    });
  
    if (isLoading) {
      return <p>Loading...</p>;
    }
  
    if (isError) {
      return <p>Error loading image</p>;
    }
  
    // Get cached image from query cache
    const queryKey = ['image', src];
    const queryResult = useQuery(queryKey, () => loadedSrc, {
      initialData: loadedSrc,
    });
  
    return <img src={queryResult.data} alt={alt} {...props} />;
  }