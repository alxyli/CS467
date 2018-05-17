import React from 'react'
import {Sigma, RandomizeNodePositions, RelativeSize, NOverlap} from 'react-sigma';

var sigmaGraphData = {
      nodes: [],
      edges: []
}

var xCoord = 0;
var yCoord = 0;

export class GraphRenderer extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			graphData: this.props.graphData,
		};

		this.buildSigmaGraph = this.buildSigmaGraph.bind(this);
		this.buildSigmaNodes = this.buildSigmaNodes.bind(this);
	}

	buildSigmaNodes(graphData) {
    Object.entries(graphData).map(([key, value]) => {
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
        x: xCoord,
        y: yCoord,
        size: 7,
        color: color
      }

      sigmaGraphData.nodes.push(tempNode);
      xCoord++;
      yCoord++;
    });

    console.log(sigmaGraphData);
  } 

  buildSigmaGraph(graphData) {
  	this.buildSigmaNodes(graphData);

  	var i = 0;
  	Object.keys(sigmaGraphData.nodes).map((nodes, idx) => {
  	
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

	render() {
			return (
				<div>
					<Sigma graph={ this.buildSigmaGraph(this.state.graphData) } style={{width: "1000px", height: "500px" }} settings={{drawEdges: true, clone: false}}>
          <RandomizeNodePositions />
          <NOverlap nodeMargin={15} gridSize={1000} maxIterations={150}/>
        	</Sigma>
				</div>
			)
		}
}

