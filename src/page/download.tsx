// import React,{useState} from 'react';

// type ImageFormat='image/png'| 'image/jpeg' | 'image/webp'|'image/jpg';
// interface FileInfo{
//     file:File;
//     name: string;
//     size: number;
//     originalFormat: string;
// }
// export default function ImageConverter(){
//     const [selectedFile,setSelectedFile]=useState<FileInfo | null>(null);
//     const [targetFormat,setTargetFormat]=useState<ImageFormat>('image/jpeg');
//     const [isConverting,setIsConverting]=useState<boolean>(false);
//     const [convertedFile,setConvertedFile]=useState<Blob |null>(null);
//     const handleFileSelect=(event:React.ChangeEvent<HTMLInputElement>)=>{
//         const file = event.target.files?.[0];
//         if(file){
//             if(file.type.startsWith('image/')){
//                 const fileInfo:FileInfo={
//                     file:file,
//                     name:file.name,
//                     size:file.size,
//                     originalFormat: file.type
//                 };
//                 setSelectedFile(fileInfo);
//                 setConvertedFile(null);
//             }else{
//                 alert("Please select and Image File");
//             }
//         }
//     };
//     const handleFormatChange=(event:React.ChangeEvent<HTMLSelectElement>)=>{
//         setTargetFormat(event.target.value as ImageFormat);
//     };
//     const convertImage=async()=>{
//         if(!selectedFile){
//             alert('Please select a file first');
//             return;
//         }

//     setIsConverting(true);
    
//     try {
//       // Create a new Image element to load our file
//       const img = new Image();
      
//       // Create a promise that resolves when image loads
//       const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
//         img.onload = () => resolve(img);
//         img.onerror = () => reject(new Error('Failed to load image'));
//       });
      
//       // Convert file to data URL so we can load it
//       const reader = new FileReader();
//       const fileReadPromise = new Promise<string>((resolve, reject) => {
//         reader.onload = (e) => {
//           const result = e.target?.result;
//           if (typeof result === 'string') {
//             resolve(result);
//           } else {
//             reject(new Error('Failed to read file'));
//           }
//         };
//         reader.onerror = () => reject(new Error('Failed to read file'));
//       });
      
//       // Start reading the file
//       reader.readAsDataURL(selectedFile.file);
      
//       // Wait for file to be read
//       const dataUrl = await fileReadPromise;
      
//       // Load the image
//       img.src = dataUrl;
//       await imageLoadPromise;
      
//       // Create a canvas to draw the image
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
      
//       if (!ctx) {
//         throw new Error('Could not get canvas context');
//       }
      
//       // Set canvas size to match image
//       canvas.width = img.width;
//       canvas.height = img.height;
      
//       // Draw the image on canvas
//       ctx.drawImage(img, 0, 0);
      
//       // Convert canvas to blob in target format
//       const convertedBlob = await new Promise<Blob>((resolve, reject) => {
//         canvas.toBlob((blob) => {
//           if (blob) {
//             resolve(blob);
//           } else {
//             reject(new Error('Failed to convert image'));
//           }
//         }, targetFormat, 0.9); // 0.9 is quality for JPEG
//       });
      
//       // Save the converted file
//       setConvertedFile(convertedBlob);
//       setIsConverting(false);
      
//     } catch (error) {
//       console.error('Conversion failed:', error);
//       alert('Conversion failed! Please try again.');
//       setIsConverting(false);
//     }
//   };

//   // STEP 6: Download converted image
//   const downloadImage = () => {
//     if (!convertedFile || !selectedFile) return;
    
//     // Create a download link
//     const url = URL.createObjectURL(convertedFile);
//     const link = document.createElement('a');
//     link.href = url;
    
//     // Generate filename with new extension
//     const originalName = selectedFile.name.split('.')[0]; // Remove extension
//     const newExtension = targetFormat.split('/')[1]; // Get extension from MIME type
//     link.download = `${originalName}.${newExtension}`;
    
//     // Trigger download
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     // Clean up
//     URL.revokeObjectURL(url);
//   };

//   // STEP 7: Format file size for display
//   const formatFileSize = (bytes: number): string => {
//     if (bytes === 0) return '0 Bytes';
    
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
    
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   // STEP 7: Render our component (what the user sees)
//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
//         Image Converter
//       </h1>
      
//       {/* File Selection */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Select Image
//         </label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileSelect}
//           className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>

//       {/* Show selected file info */}
//       {selectedFile && (
//         <div className="mb-6 p-4 bg-gray-50 rounded-md">
//           <h3 className="font-semibold text-gray-700 mb-2">Selected File:</h3>
//           <p><strong>Name:</strong> {selectedFile.name}</p>
//           <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
//           <p><strong>Format:</strong> {selectedFile.originalFormat}</p>
//         </div>
//       )}

//       {/* Format Selection */}
//       {selectedFile && (
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Convert To:
//           </label>
//           <select
//             value={targetFormat}
//             onChange={handleFormatChange}
//             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="image/jpeg">JPEG</option>
//             <option value="image/png">PNG</option>
//             <option value="image/webp">WebP</option>
//           </select>
//         </div>
//       )}

//       {/* Convert Button */}
//       {selectedFile && (
//         <button
//           onClick={convertImage}
//           disabled={isConverting}
//           className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//         >
//           {isConverting ? 'Converting...' : 'Convert Image'}
//         </button>
//       )}

//       {/* Download Button - Show after conversion */}
//       {convertedFile && (
//         <div className="mt-6 p-4 bg-green-50 rounded-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-green-800">✅ Conversion Complete!</h3>
//               <p className="text-green-700">Your image has been converted to {targetFormat.split('/')[1].toUpperCase()}</p>
//             </div>
//             <button
//               onClick={downloadImage}
//               className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
//             >
//               Download
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Instructions */}
//       <div className="mt-8 p-4 bg-blue-50 rounded-md">
//         <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
//         <ol className="list-decimal list-inside text-blue-700 space-y-1">
//           <li>Click "Choose File" and select an image</li>
//           <li>Choose your desired output format</li>
//           <li>Click "Convert Image"</li>
//           <li>Download your converted image</li>
//         </ol>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';

type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

interface FileInfo {
  file: File;
  name: string;
  size: number;
  originalFormat: string;
}

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/jpeg');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (file) {
      if (file.type.startsWith('image/')) {
        const fileInfo: FileInfo = {
          file: file,
          name: file.name,
          size: file.size,
          originalFormat: file.type
        };
        setSelectedFile(fileInfo);
        setConvertedFile(null);
      } else {
        alert('Please select an image file!');
      }
    }
  };

const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setTargetFormat(event.target.value as ImageFormat);
};

  const convertImage = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    setIsConverting(true);
    
    try {
      const img = new Image();
      
      const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      
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
      
      reader.readAsDataURL(selectedFile.file);
      const dataUrl = await fileReadPromise;
      
      img.src = dataUrl;
      await imageLoadPromise;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const convertedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        }, targetFormat, 0.9);
      });
      
      setConvertedFile(convertedBlob);
      setIsConverting(false);
      
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed! Please try again.');
      setIsConverting(false);
    }
  };

  const downloadImage = () => {
    if (!convertedFile || !selectedFile) return;
    
    const url = URL.createObjectURL(convertedFile);
    const link = document.createElement('a');
    link.href = url;
    
    const originalName = selectedFile.name.split('.')[0];
    const newExtension = targetFormat.split('/')[1];
    link.download = `${originalName}.${newExtension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'image/jpeg':
        return '🖼️';
      case 'image/png':
        return '🎨';
      case 'image/webp':
        return '🌟';
      default:
        return '📷';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Image Converter
                </h1>
                <p className="text-sm text-gray-500">Convert images instantly in your browser</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Created by</p>
              <p className="font-semibold text-gray-800">Laavvya Tanotra</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    📁
                  </span>
                  Upload Image
                </h2>
              </div>
              
              <div className="p-6">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white text-2xl">📷</span>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        {dragActive ? 'Drop your image here' : 'Drag & drop your image here'}
                      </p>
                      <p className="text-gray-500 mt-1">or</p>
                    </div>
                    <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 cursor-pointer transform hover:scale-105">
                      <span>Browse Files</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    Supports: JPG, PNG, WebP • Max size: 10MB
                  </p>
                </div>

                {selectedFile && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-lg">{getFormatIcon(selectedFile.originalFormat)}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{selectedFile.name}</h3>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(selectedFile.size)} • {selectedFile.originalFormat.split('/')[1].toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    🎯
                  </span>
                  Convert To
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {(['image/jpeg', 'image/png', 'image/webp'] as ImageFormat[]).map((format) => (
                    <label
                      key={format}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        targetFormat === format
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={targetFormat === format}
                        onChange={handleFormatChange}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3 w-full">
                        <span className="text-2xl">{getFormatIcon(format)}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {format.split('/')[1].toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format === 'image/jpeg' && 'Best for photos'}
                            {format === 'image/png' && 'Best for graphics'}
                            {format === 'image/webp' && 'Modern format'}
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          targetFormat === format
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {targetFormat === format && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {selectedFile && (
              <button
                onClick={convertImage}
                disabled={isConverting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                {isConverting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Converting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>✨</span>
                    <span>Convert Image</span>
                  </div>
                )}
              </button>
            )}

            {convertedFile && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-2xl">✅</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 text-lg">
                      Conversion Complete!
                    </h3>
                    <p className="text-green-700 text-sm">
                      Your image is ready to download
                    </p>
                  </div>
                  <button
                    onClick={downloadImage}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>⬇️</span>
                      <span>Download</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">✨ Features</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-600">Convert images instantly in your browser</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">100% Private</h3>
                <p className="text-sm text-gray-600">Your images never leave your device</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">No Upload Needed</h3>
                <p className="text-sm text-gray-600">Works completely offline</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Made with ❤️ by <span className="font-semibold text-gray-800">Laavvya Tanotra</span>
            </p>
            <p className="text-sm text-gray-500">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}