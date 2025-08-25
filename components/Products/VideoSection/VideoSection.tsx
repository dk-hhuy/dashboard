import React, { useState } from 'react'
import { Product } from '@/types/product'

interface VideoSectionProps {
  product: Product
}

const VideoSection: React.FC<VideoSectionProps> = ({ product }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const handlePreviousVideo = () => {
    setCurrentVideoIndex(prev => Math.max(0, prev - 1))
  }

  const handleNextVideo = () => {
    setCurrentVideoIndex(prev => Math.min((product.productVideos?.length || 1) - 1, prev + 1))
  }

  const getYouTubeEmbedUrl = (url: string) => {
    // Extract video ID from YouTube URL
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  return (
    <div className="content is-size-7">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h4 className="title is-4 is-size-7">
          Videos 
          <span className="has-text-grey-light ml-2 is-size-7">
            ({product.productVideos?.length || 0} total)
          </span>
        </h4>
      </div>
      
      <div className="mt-4">
        {product.productVideos && product.productVideos.length > 0 ? (
          <div className="box p-4 has-background-light">
            {/* Video Player */}
            <div className="has-text-centered mb-4">
              <div className="video-container" style={{ position: 'relative', paddingBottom: '30%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
                <iframe
                  src={getYouTubeEmbedUrl(product.productVideos[currentVideoIndex])}
                  title={`Video ${currentVideoIndex + 1}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                  allowFullScreen
                />
              </div>
            </div>

            {/* Video Navigation */}
            <div className="is-flex is-justify-content-center is-align-items-center mb-4">
              <button 
                className="button is-primary is-small is-size-7 mr-3"
                onClick={handlePreviousVideo}
                disabled={currentVideoIndex === 0}
              >
                <span className="icon is-small">
                  <i className="material-icons is-size-7">chevron_left</i>
                </span>
                <span>Previous</span>
              </button>
              
              <span className="has-text-grey-dark is-size-7 mx-3">
                {currentVideoIndex + 1} / {product.productVideos.length}
              </span>
              
              <button 
                className="button is-primary is-small is-size-7 ml-3"
                onClick={handleNextVideo}
                disabled={currentVideoIndex === (product.productVideos.length - 1)}
              >
                <span>Next</span>
                <span className="icon is-small">
                  <i className="material-icons is-size-7">chevron_right</i>
                </span>
              </button>
            </div>

            

            <div className="has-text-centered mt-4">
              <p className="has-text-grey-light is-size-7">
                {product.productVideos.length} video(s) available • Click thumbnails to switch videos
              </p>
            </div>
          </div>
        ) : (
          <div className="has-text-centered p-6">
            <span className="icon is-large has-text-grey-light mb-3">
              <i className="material-icons is-size-1">video_library</i>
            </span>
            <p className="has-text-grey-light is-size-7 mb-3">No videos available</p>
            <p className="has-text-grey-light is-size-7">
              Videos will be added here when available
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoSection 