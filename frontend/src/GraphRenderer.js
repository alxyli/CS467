import React from 'react'
import {Sigma, RandomizeNodePositions, RelativeSize} from 'react-sigma';

var sigmaGraphData = {
      nodes: [],
      edges: []
}

export class GraphRenderer extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			graphData: this.props.graphData,
			xCoord: 0,
			yCoord: 0
		};

		this.buildSigmaGraph = this.buildSigmaGraph.bind(this);
		this.buildSigmaNodes = this.buildSigmaNodes.bind(this);
		this.incrementXCoord = this.incrementXCoord.bind(this);
		this.incrementYCoord = this.incrementYCoord.bind(this);
	}

	incrementXCoord() {
		this.setState((prevState) => {
			return {xCoord: prevState.xCoord + 1}
		});
	}

	incrementYCoord() {
		this.setState((prevState) => {
			return {yCoord: prevState.yCoord + 1}
		});
	}

	buildSigmaNodes(graphData) {
    Object.entries(graphData).map(([key, value]) => {
      let parentid = value.parentid;
      let parentNode = "";

      // first node, set parentNode to current id
      if (parentid == 0) {
        parentNode = value.id;
      }

      // otherwise set parent node to parent id
      else {
        parentNode = value.parentid;
      }

      let tempNode = {
        id: "n" + value.id,
        label: value.url,
        parent: "n" + parentNode,
        size: 7
      }

      sigmaGraphData.nodes.push(tempNode);
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
  				target: sigmaGraphData.nodes[idx].parent
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
        	</Sigma>
				</div>
			)
		}
}

