import React, {useState} from 'react';
import {addPosition} from "../../../utils/CustomFunctions";

const CarouselBlock = ({block}) => {

    const carouselImages = addPosition(block.images)
    const imageCount = carouselImages.length
    const [activeImagePosition, setActiveImagePosition] = useState(1)


    function prevImage() {
        if (activeImagePosition !== 1) {
            setActiveImagePosition(activeImagePosition-1)
        } else {
            setActiveImagePosition(imageCount)
        }
    }

    function nextImage() {
        if (activeImagePosition !== imageCount) {
            setActiveImagePosition(activeImagePosition+1)
        } else {
            setActiveImagePosition(1)
        }

    }

    return (
        <div className='article-block-carousel'>
            <div className="carousel-container">
                {carouselImages.map(image =>
                        <div
                            key={image.id}
                            style={{zIndex: image.pos}}
                            className={image.pos < activeImagePosition ? 'image-container back'
                                : image.pos === activeImagePosition ? 'image-container center' : 'image-container right'}
                        >
                            <img src={image.image}/>
                            {image.title ? <p>{image.title}</p> : null}
                        </div>
                )}
                <div className="prev-btn" onClick={prevImage}><span>&#10094;</span></div>
                <div className="next-btn" onClick={nextImage}><span>&#10095;</span></div>
            </div>
            <div className="carousel-line">
                {carouselImages.map(image =>
                    <span
                        key={image.pos}
                        onClick={() => {setActiveImagePosition(image.pos)}}
                        className={image.pos === activeImagePosition ? 'line-part active' : 'line-part'}/>
                )}
            </div>
        </div>
    );
};


export default CarouselBlock;