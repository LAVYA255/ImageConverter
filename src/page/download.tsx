import React,{useState} from 'react';

type ImageFormat='image/png'| 'image/jpeg' | 'image/webp'|'image/jpg';
interface FileInfo{
    file:File;
    name: string;
    size: number;
    originalFormat: string;
}
export default function ImageConverter(){
    const [selectedFile,setSelectedFile]=useState<FileInfo | null>(null);
    const [targetFormat,setTargetFormat]=useState<ImageFormat>('image/jpeg');
    const [isConverting,setIsConverting]=useState<boolean>(false);
    const [convertedFile,setConvertedFile]=useState<Blob |null>(null);
    const handleFileSelect=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const file = event.target.files?.[0];
        if(file){
            if(file.type.startsWith('image/')){
                const fileInfo:FileInfo={
                    file:file,
                    name:file.name,
                    size:file.size,
                    originalFormat: file.type
                };
                setSelectedFile(fileInfo);
                setConvertedFile(null);
            }else{
                alert("Please select and Image File");
            }
        }
    };
    const handleFormatChange=(event:React.ChangeEvent<HTMLSelectElement>)=>{
        setTargetFormat(event.target.value as ImageFormat);
    };
    const convertImage=async()=>{
        if(!selectedFile){
            alert('Please select a file first');
            return;
        }

    setIsConverting(true);
    
    try {
      // Create a new Image element to load our file
      const img = new Image();
      
      // Create a promise that resolves when image loads
      const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      
      // Convert file to data URL so we can load it
      const reader = new FileReader();
      const fileReadPromise = new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            resolve(result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
      });
      
      // Start reading the file
      reader.readAsDataURL(selectedFile.file);
      
      // Wait for file to be read
      const dataUrl = await fileReadPromise;
      
      // Load the image
      img.src = dataUrl;
      await imageLoadPromise;
      
      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image on canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert canvas to blob in target format
      const convertedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        }, targetFormat, 0.9); // 0.9 is quality for JPEG
      });
      
      // Save the converted file
      setConvertedFile(convertedBlob);
      setIsConverting(false);
      
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed! Please try again.');
      setIsConverting(false);
    }
  };

  // STEP 6: Download converted image
  const downloadImage = () => {
    if (!convertedFile || !selectedFile) return;
    
    // Create a download link
    const url = URL.createObjectURL(convertedFile);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with new extension
    const originalName = selectedFile.name.split('.')[0]; // Remove extension
    const newExtension = targetFormat.split('/')[1]; // Get extension from MIME type
    link.download = `${originalName}.${newExtension}`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  // STEP 7: Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // STEP 7: Render our component (what the user sees)
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Image Converter
      </h1>
      
      {/* File Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Show selected file info */}
      {selectedFile && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2">Selected File:</h3>
          <p><strong>Name:</strong> {selectedFile.name}</p>
          <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
          <p><strong>Format:</strong> {selectedFile.originalFormat}</p>
        </div>
      )}

      {/* Format Selection */}
      {selectedFile && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Convert To:
          </label>
          <select
            value={targetFormat}
            onChange={handleFormatChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      )}

      {/* Convert Button */}
      {selectedFile && (
        <button
          onClick={convertImage}
          disabled={isConverting}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isConverting ? 'Converting...' : 'Convert Image'}
        </button>
      )}

      {/* Download Button - Show after conversion */}
      {convertedFile && (
        <div className="mt-6 p-4 bg-green-50 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800">✅ Conversion Complete!</h3>
              <p className="text-green-700">Your image has been converted to {targetFormat.split('/')[1].toUpperCase()}</p>
            </div>
            <button
              onClick={downloadImage}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
        <ol className="list-decimal list-inside text-blue-700 space-y-1">
          <li>Click "Choose File" and select an image</li>
          <li>Choose your desired output format</li>
          <li>Click "Convert Image"</li>
          <li>Download your converted image</li>
        </ol>
      </div>
    </div>
  );
}