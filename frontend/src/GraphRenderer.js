import React from 'react'
import {Sigma, RandomizeNodePositions, RelativeSize, NOverlap} from 'react-sigma';
import styles from './css/Form.css';

var sigmaGraphData = {
      nodes: [],
      edges: []
}

export class GraphRenderer extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			graphData: this.props.graphData,
		};

		this.buildSigmaGraph = this.buildSigmaGraph.bind(this);
		this.buildSigmaNodes = this.buildSigmaNodes.bind(this);
    this.backButtonHandler = this.backButtonHandler.bind(this);
	}

	buildSigmaNodes(graphData) {
    Object.entries(graphData).forEach(([key, value]) => {
      let parentid = value.parentid;
      let parentNode = "";
      let color = "";
      // first node, set parentNode to current id
      // also sets color of first node
      if (parentid === 0) {
        parentNode = value.id;
        color = '#f5b041';
      }

      // sets color of last node
      else if (value.id === graphData.length) {
        color = '#a569bd';
        parentNode = value.parentid;
      }

      // otherwise set parent node to parent id
      // set all nodes in between start and end to the same color
      else {
        parentNode = value.parentid;
        color = '#7fb3d5';
      }

      let tempNode = {
        id: "n" + value.id,
        label: value.url,
        parent: "n" + parentNode,
        size: 7,
        color: color
      }

      sigmaGraphData.nodes.push(tempNode);
    });

    console.log(sigmaGraphData);
  } 

  buildSigmaGraph(graphData) {
  	this.buildSigmaNodes(graphData);

  	var i = 0;
  	Object.keys(sigmaGraphData.nodes).forEach((nodes, idx) => {
  	
  			console.log(idx);

  			let tempEdge = {
  				id: "e" + i++,
  				source: sigmaGraphData.nodes[idx].id,
  				target: sigmaGraphData.nodes[idx].parent,
          color: '#2c3e50'
   			}

   			console.log(tempEdge);
   			sigmaGraphData.edges.push(tempEdge);
  	})

  	console.log(sigmaGraphData);
  	return sigmaGraphData;
  }

  backButtonHandler() {
    // wipe sigmaGraphData object on Back button press
    sigmaGraphData = {
      nodes: [],
      edges: []
    }
    this.props.backHandler();
  }

	render() {
			return (
				<div>
					<Sigma graph={ this.buildSigmaGraph(this.state.graphData) } 
          style={{height: "550px"}}
          settings={{drawEdges: true, clone: false, batchEdgesDrawing: true, hideEdgesOnMove: true, labelThreshold: 14}} 
          onClickNode={e => window.open(e.data.node.label)}>
          <RandomizeNodePositions />
          <NOverlap nodeMargin={20} gridSize={200} maxIterations={100} speed={75}/>
          </Sigma>
           <div className={styles.btnAnimate}>
            <button className={styles.backBtn} onClick={this.backButtonHandler} type="button" >Back</button>
           </div>
				</div>
			)
		}
}

