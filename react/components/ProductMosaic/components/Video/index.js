import React from 'react'
import PropTypes from 'prop-types'
import { match, compose, isEmpty, complement } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'
import { NoSSR } from 'vtex.render-runtime'
import ReactPlayer from 'react-player/lazy'

import Vimeo from './Vimeo'
import YouTube from './Youtube'

const isNotEmpty = complement(isEmpty)

const isVimeo = compose(isNotEmpty, match(/vimeo/))
const isYoutube = compose(isNotEmpty, match(/youtube|youtu.be/))
const isMp4 = compose(isNotEmpty, match(/.mp4/))

const CSS_HANDLES = ['productVideo', 'videoContainer', 'video']

export function getThumbUrl(url, thumbWidth) {
  if (isVimeo(url)) {
    return Vimeo.getThumbUrl(url, thumbWidth)
  }

  if (isYoutube(url)) {
    return YouTube.getThumbUrl(url, thumbWidth)
  }
}

function Video(props) {
  const { url } = props
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.productVideo}>
      {isVimeo(url) && (
        <NoSSR>
          <Vimeo key={url} {...props} cssHandles={handles} />
        </NoSSR>
      )}
      {isYoutube(url) && <YouTube key={url} {...props} cssHandles={handles} />}
      {isMp4(url) && (
        <video style={{objectFit:"cover!important", maxHeight:"722px"}} loop="true" autoplay="autoplay" muted>
          <source src={url}  type="video/mp4"/>
        </video>
      )}
    </div>
  )
}

Video.propsTypes = {
  url: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  setThumb: PropTypes.func,
  thumbWidth: PropTypes.number,
  className: PropTypes.string,
  play: PropTypes.bool,
}

export default Video
