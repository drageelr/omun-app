import React from 'react';

export default function FlagIfAvailable({imageName, imageStyle}) {
    try {
        return (
            <div 
            style={{
                backgroundImage:`url("${require(`../flag/${imageName}.png`)}")`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover', backgroundPosition:'center',
                width: '1.5vw',
                height: '1.5vw',
                margin: 5,
                alignSelf: 'center',
                ...imageStyle,
            }}>
            </div>
        );
    }
  catch { // image not found
      // nothing returned
        return <div></div>
    }
}