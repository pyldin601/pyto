import * as React from 'react';

interface FieldInterface {
  width: number,
  height: number,
  picture: number[],
}

export default (props: FieldInterface): React.SFC<FieldInterface> => {
  return (
    <div className="field">
      Hello
    </div>
  );
};
