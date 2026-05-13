
self.onmessage = (e: any) => {
  const { imageData, type, threshold } = e.data;
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Rec. 709 luminance formula
    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
    if (type === 'pure-bw') {
      const bw = gray > threshold ? 255 : 0;
      data[i] = bw;
      data[i+1] = bw;
      data[i+2] = bw;
    } else {
      data[i] = gray;
      data[i+1] = gray;
      data[i+2] = gray;
    }
  }
  
  (self as any).postMessage({ imageData }, [imageData.data.buffer]);
};
