import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Context from '../Context';
import Dock from '../Dock';

const getStyle = ({ hasPanels, location, width }) => {
  const style = {
    height: '100%',
    width,
    position: hasPanels ? null : 'absolute',
  };

  if (location === 'left') {
    style.left = hasPanels ? null : 0;
  } else if (location === 'right') {
    style.right = hasPanels ? null : 0;
  }

  return style;
};

function AreaDock(props) {
  const { location, width } = props;
  const uidRef = useRef(location);
  const uid = uidRef.current;

  return (
    <Context.Consumer>
      {(context) => {
        const { docks } = context;
        const dock = docks.get(uid);
        const hasPanels = dock && dock.panels.size > 0;
        const style = getStyle({ hasPanels, location, width });

        return (
          <Dock uid={uid}>
            <div style={style} />
          </Dock>
        );
      }}
    </Context.Consumer>
  );
}

AreaDock.propTypes = {
  location: PropTypes.oneOf(['left', 'right']).isRequired,
  width: PropTypes.number,
};

AreaDock.defaultProps = {
  width: null,
};

export default AreaDock;
