import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class NodeInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSubmenu: false,
      peerCount: 0,
      timestamp: Date.now()
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    web3.eth.net.getPeerCount((error, result) => {
      if (!error) {
        this.setState({ peerCount: result });
      }
    });

    this.setState({ timestamp: this.state.timestamp + 1 });
  };

  renderRemoteStats() {
    // hide remote stats if you're all synced up
    if (this.props.active !== 'remote') {
      return null;
    }

    const remoteTimestamp = moment.unix(this.props.remote.timestamp);
    const diff = moment().diff(remoteTimestamp, 'seconds');

    return (
      <div id="remote-stats" className="node-info__section">
        <div className="node-info__node-title orange">
          REMOTE <span className="node-info__pill">active</span>
        </div>
        <div>
          <i className="icon-layers" /> {this.props.remote.blockNumber}
        </div>
        <div>
          <i className="icon-clock" /> {diff} seconds
        </div>
      </div>
    );
  }

  renderLocalStats() {
    const {
      highestBlock,
      currentBlock,
      startingBlock,
      syncMode
    } = this.props.local;

    const blocksBehind = highestBlock - currentBlock;
    const progress =
      (currentBlock - startingBlock) / (highestBlock - startingBlock) * 100;

    const timeSince = moment(EthBlocks.latest.timestamp, 'X');
    const diff = moment().diff(timeSince, 'seconds');

    let localStats;

    if (this.props.active === 'remote') {
      localStats = (
        <div>
          <div className="block-number">
            <i className="icon-layers" /> {blocksBehind || '—'} blocks behind
          </div>
          <div>
            <i className="icon-users" /> {this.state.peerCount} peers
          </div>
          <div>
            <i className="icon-cloud-download" />
            <progress max="100" value={progress || 0} />
          </div>
        </div>
      );
    } else {
      localStats = (
        <div>
          <div className="block-number">
            <i className="icon-layers" /> {currentBlock}
          </div>
          <div>
            <i className="icon-users" /> {thist.state.peerCount} peers
          </div>
          <div>
            <i className="icon-clock" /> {diff} seconds
          </div>
        </div>
      );
    }

    return (
      <div id="local-stats" className="node-info__section">
        <div className="node-info__node-title">
          LOCAL
          <span className="node-info__pill">{syncMode} sync</span>
        </div>

        {localStats}
      </div>
    );
  }

  render() {
    const { active, network } = this.props;
    const lightColor = active === 'remote' ? 'orange' : '#24C33A';

    return (
      <div id="node-info">
        <div
          id="node-info__light"
          style={{ backgroundColor: lightColor }}
          onMouseEnter={() =>
            this.setState({ showSubmenu: !this.state.showSubmenu })
          }
        />

        {this.state.showSubmenu && (
          <section className="node-info__submenu-container">
            <section>
              <div className="node-info__section">
                <div className="node-info__subtitle">Network</div>
                <div
                  style={{
                    fontWeight: 'bold',
                    color: '#24C33A',
                    textTransform: 'uppercase'
                  }}
                >
                  {network}
                </div>
              </div>

              {this.renderRemoteStats()}

              {this.renderLocalStats()}
            </section>
          </section>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    active: state.nodes.active,
    network: state.nodes.network,
    remote: state.nodes.remote,
    local: state.nodes.local
  };
}

export default connect(mapStateToProps)(NodeInfo);
