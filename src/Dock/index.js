import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';

import withContext from '../withContext';
import PanelTabs from './PanelTabs';

class Dock extends Component {
  constructor() {
    super();
    this.ref = React.createRef();
    this.dockableAreaRef = React.createRef();

    this.state = {
      activePanelRef: null,
      height: null,
    };
  }

  componentDidMount() {
    const { context } = this.props;

    context.registerDock(this.ref, {
      props: this.props,
      dockableAreaRef: this.dockableAreaRef,
    });

    const { parentNode } = this.ref.current;
    const parentHeight = parentNode.getBoundingClientRect().height;

    this.setState({
      height: parentHeight,
    });

    const resizeObserver = new ResizeObserver(() => {
      context.updateDock(this.ref, this.props);
    });

    const dockableAreaNode = this.dockableAreaRef.current;

    resizeObserver.observe(dockableAreaNode);
  }

  getPanels = () => {
    const { context } = this.props;
    const dock = context.provider.docks.get(this.ref);

    if (!dock) return new Map();

    return dock.panels;
  };

  handleTabClick = (panel) => {
    const { context } = this.props;
    const { setDockActivePanel } = context;

    setDockActivePanel(this.ref, panel.ref);

    this.setState({
      activePanelRef: panel.ref,
    });
  };

  render() {
    const { activePanelRef, height } = this.state;
    const panels = this.getPanels();

    return (
      <div ref={this.ref} style={{ display: 'flex', flexDirection: 'column', height }}>
        {panels.size > 0 && (
          <PanelTabs
            activePanelRef={activePanelRef}
            panels={panels}
            onTabClick={this.handleTabClick}
          />
        )}

        <div ref={this.dockableAreaRef} style={{ flexGrow: 1 }} />
      </div>
    );
  }
}

Dock.propTypes = {
  context: PropTypes.shape({
    panels: PropTypes.instanceOf(Map).isRequired,
    registerPanel: PropTypes.func.isRequired,
    registerDock: PropTypes.func.isRequired,
    snapToDock: PropTypes.func.isRequired,
    docks: PropTypes.instanceOf(Map).isRequired,
  }).isRequired,
  id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
};

Dock.defaultProps = {
  id: null,
};

export default withContext(Dock);
