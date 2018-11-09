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
        let blocks = [];
        for(let i = 0; i < 10; i++){
            blocks.push(<SchedBlock topC={"green"} id ={i} assignedClass={"x"} letterDay={"M"} key = {i} y={i*10} x={50} width ={10} height = {10} name = {"test"}/>);
        }
        console.log(lines);
        return <div id = {"SchedGrid"}>{blocks}{lines}</div>;
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
        this.x = props.x;
        this.width = props.width;
        this.height = props.height;
        this.letterDay = props.letterDay;
        this.topC = props.topC;
        this.id = props.id;
        this.assignedClass = props.assignedClass;
        this.name = props.name;
    }

    render(){
        return<div className = {"SchedBlock_container "+this.letterDay+" "+this.topC}
                    style = {{left:this.x+"%",top:this.y+"%",width:this.width+"%",height:this.height+"%"}}>
                    <div className={"SchedBlock " +this.letterday+" "+ this.topC+" "+this.assignedClass} id = {this.id}
                         onClick={"angular.element(document.body).scope().clearSearch();"+
                                  "angular.element(document.body).scope().initiateSearch("+this.assignedClass+", "+"'courseIDSearch');"}>
                        <div className={"CloseX"} style={{width:100+"%",height:100+"%"}}><span
                            onClick={"e.stopPropagation(); angular.element(document.body).scope().sched.AddRem(thisBlock.class);"}>X</span></div>
                        <div className={"NeedAssc"}
                             title={"Registration is required for an associated section."}><b>!</b></div>
                        <span className={"SecName"}>{this.name}</span>
                    </div>
                </div>
    }


}

ReactDOM.render(<SchedGrid/>, document.querySelector("#SchedGrid_container"));