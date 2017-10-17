import * as React from 'react';
import * as cn from 'classnames';

interface FieldInterface {
  width: number,
  height: number,
  picture: string[],
}

export default ({ width, height, picture }: FieldInterface) => {
  const pixelStyle = {
    width: `${100 / width}%`,
    height: `${100 / height}%`,
  };

  return (
    <div className="field">
      {picture.map((pixel, i) => {
        return <div key={i} className={cn('pixel', pixel)} style={pixelStyle}/>
      })}
    </div>
  );
};
