import React, { useRef, useEffect, useState } from 'react'

const CameraCapture = ({ onCapture, onClose }) => {
  // ========================================
  // CAMERA CAPTURE COMPONENT
  // ========================================
  // TODO: DATABASE INTEGRATION - Consider implementing:
  // - Image compression before storage
  // - Cloud storage for images (AWS S3, Cloudinary, etc.)
  // - Image metadata storage in database
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        }
      })
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false)
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions.')
      setIsLoading(false)
    }
  }

  // ========================================
  // PHOTO CAPTURE FUNCTION
  // ========================================
  // TODO: DATABASE INTEGRATION - Enhance image handling:
  // - Implement image compression for better performance
  // - Add image format options (JPEG, PNG, WebP)
  // - Consider implementing image upload to cloud storage
  
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to data URL
    // FUTURE DATABASE IMPLEMENTATION:
    // Consider implementing image compression and optimization
    // const compressImage = (canvas, quality = 0.8) => {
    //   return canvas.toDataURL('image/jpeg', quality)
    // }
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    
    // FUTURE DATABASE IMPLEMENTATION:
    // Consider uploading image to cloud storage and storing URL in database
    // const uploadImageToCloud = async (imageData) => {
    //   try {
    //     const formData = new FormData()
    //     formData.append('image', imageData)
    //     const response = await fetch('/api/upload-image', {
    //       method: 'POST',
    //       body: formData
    //     })
    //     const { imageUrl } = await response.json()
    //     return imageUrl
    //   } catch (error) {
    //     console.error('Error uploading image:', error)
    //     return imageData // Fallback to base64
    //   }
    // }
    
    onCapture(imageData)
  }

  const retakePhoto = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Camera Error</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={startCamera}
              className="btn-primary flex-1"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl mx-4 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Capture Product Photo</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover rounded-lg border"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={capturePhoto}
                className="btn-primary flex-1"
              >
                📸 Capture Photo
              </button>
              <button
                onClick={retakePhoto}
                className="btn-secondary flex-1"
              >
                🔄 Retake
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Position your product in the camera view and click capture</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CameraCapture
