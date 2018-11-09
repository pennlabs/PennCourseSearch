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
        let lines = [];
        for(let i = 0; i < this.state.schedLines.length; i++){
            lines.push(<SchedLine key = {i} y = {this.state.schedLines[i]}/>);
        }
        console.log(lines);
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

class SchedBlock extends React.Component{

    constructor(props){
        super(props);
        this.y = props.y;
        this.x = prop.x;
        this.width = props.width;
        this.height = props.height;
        this.letterDay = props.letterDay;
        this.topC = props.topC;
    }

    render(){
        return <div className = {"SchedBlock_container "+this.letterDay+" "+this.topC}
                    style = {{left:this.x+"%",top:this.y+"%",width:this.width+"%",height:this.height+"%"}}>
        </div>
    }


}

ReactDOM.render(<SchedGrid/>, document.querySelector("#SchedGrid_container"));