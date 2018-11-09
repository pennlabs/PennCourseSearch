'use strict';

let schedGridRef = null;

class SchedGrid extends React.Component{

    constructor(props){
        super(props);
        schedGridRef = this;
        this.state = {schedBlocks:[],schedLines:[]};
    }

    updateSchedLines(schedLines){
        this.setState(state=>({schedLines: schedLines}));
    }

    render(){
        const lines = [];
        for(let i = 0; i < this.state.schedLines.length; i++){
            console.log(this.state.schedLines[i]);
            lines.push(<SchedLine key = {i} y = {this.state.schedLines[i]}/>);
        }
        return <div id = {"SchedGrid"}>{lines}</div>;
    }
}

const updateSchedLines = function(){
    const schedLines = angular.element(document.body).scope().schedlines;
    schedGridRef.updateSchedLines(schedLines);
};

class SchedLine extends React.Component{

    constructor(props){
        super(props);
        this.y = props.y;
    }

    render(){
        return <hr width="99.7%" className="schedline" style={{top:this.y+"%"}}/>;
    }
}

ReactDOM.render(<SchedGrid/>, document.querySelector("#SchedGrid_container"));