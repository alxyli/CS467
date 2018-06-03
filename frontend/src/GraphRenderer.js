import React from 'react'
import {Sigma, RandomizeNodePositions, RelativeSize, NOverlap, ForceAtlas2} from 'react-sigma';
import ForceLink from 'react-sigma/lib/ForceLink'
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
      sigmaData: {},
      graphType: "Random",
      buildingGraph: true
		};

		this.buildSigmaGraph = this.buildSigmaGraph.bind(this);
		this.buildSigmaNodes = this.buildSigmaNodes.bind(this);
    this.backButtonHandler = this.backButtonHandler.bind(this);
  }
  
  componentDidMount(){
    var tempSigmaData = this.buildSigmaGraph(this.state.graphData);
    this.setState( { buildingGraph: false, sigmaData: tempSigmaData } )
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
        color = '#13ff00 '; // green
      }

      // sets color of last node
      else if (value.id === graphData.length) {
        color = '#8700ff'; // purple
        parentNode = value.parentid;
      }

      // otherwise set parent node to parent id
      // set intermediate node colors
      else {
        parentNode = value.parentid;
        color = '#00e4ff'; // blue
      }

      // set dead end node color
      if (value.deadend === 1) {
        color = '#ff2828'; // red
      }

      // set found search term node color
      if (value.searchmatch === 1) {
        color = '#ff8000'; // orange
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
  } 

  buildSigmaGraph(graphData) {
  	this.buildSigmaNodes(graphData);

  	var i = 0;
  	Object.keys(sigmaGraphData.nodes).forEach((nodes, idx) => {
  	
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

  randomPositionHandler = () => {
    if(this.state.graphType !== "Random")
    {
      this.setState( {graphType: "Random"} );
    }
  }

  forceDirectedHandler = () => {
    if(this.state.graphType !== "")
    {
      this.setState( {graphType: ""} );
    }
  }

	render() {

    const RandomStyle = (this.state.graphType === "Random") ? 
          (styles.backBtnSelect) : ( styles.backBtn );

    const ForceStyle = (this.state.graphType === "") ? 
          (styles.backBtnSelect) : ( styles.backBtn );

    const buttonBar = (
      <div className={styles.btnBar}>
        <button className={styles.backBtn} onClick={this.backButtonHandler} >Back</button>
        <button className={RandomStyle} onClick={this.randomPositionHandler} >Random Position</button>
        <button className={ForceStyle} onClick={this.forceDirectedHandler} >Force Directed</button>
      </div>
    )

    const SigmaProps = (this.state.graphType === "Random") ? (
      <NOverlap background nodeMargin={20} gridSize={200} maxIterations={100} speed={75}
      easing="cubicInOut" duration="1600" permittedExpansion="1.5"/>
    ) : (
      <ForceLink background easing="cubicInOut" strongGravityMode="true" scalingRation="10"
      outboundAttractionDistribution="true" iterationsPerRender="1" barnesHutOptimize="true"
      slowDown="10" duration="2000"/>
    );

    if(this.state.buildingGraph){
      return (
        <div>
          Building Graph
        </div>
      )
    }
    
    else {
      return (
        <div>
          <Sigma graph={ this.state.sigmaData } 
          style={{height: "71vh", width: "90%", "margin-left":"auto", "margin-right":"auto" }}
          settings={{drawEdges: true, clone: false, batchEdgesDrawing: true, hideEdgesOnMove: true, labelThreshold: 14}} 
          onClickNode={e => window.open(e.data.node.label)}>
          <RandomizeNodePositions />
          {SigmaProps}
          </Sigma>
          {buttonBar}
        </div>
      )
    }
  }
}

