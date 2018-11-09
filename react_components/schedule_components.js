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

    updateSchedBlocks(schedBlocks){
        this.setState(state=>({schedBlocks: schedBlocks}));
    }

    render(){
        let lines = [];
        for(let i = 0; i < this.state.schedLines.length; i++){
            lines.push(<SchedLine key = {i} y = {this.state.schedLines[i]}/>);
        }
        let blocks = [];
        for(let i = 0; i < this.state.schedBlocks.length; i++){
            const block = this.state.schedBlocks[i];
            blocks.push(<SchedBlock topC={block.topc} id ={block.id}
                                    assignedClass={block.class} letterDay={block.letterday}
                                    key = {i} y={block.top} x={block.left} width ={block.width}
                                    height = {block.height} name = {block.name}/>);
        }
        console.log(lines);
        return <div id = {"SchedGrid"}>{blocks}{lines}</div>;
    }
}

const updateSchedLines = function(){
    const schedLines = angular.element(document.body).scope().schedlines;
    schedGridRef.updateSchedLines(schedLines);
};

const updateSchedBlocks = function(){
    const schedBlocks = angular.element(document.body).scope().schedBlocks;
    schedGridRef.updateSchedBlocks(schedBlocks);
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
        const self = this;
        return<div className = {"SchedBlock_container "+this.letterDay+" "+this.topC}
                    style = {{left:this.x+"%",top:this.y+"%",width:this.width+"%",height:this.height+"%"}}>
                    <div className={"SchedBlock " +this.letterDay+" "+ this.topC+" "+this.assignedClass} id = {this.id}
                         onClick={function(){angular.element(document.body).scope().clearSearch();
                                  angular.element(document.body).scope().initiateSearch(self.assignedClass, 'courseIDSearch');}}>
                        <div className={"CloseX"} style={{width:100+"%",height:100+"%"}}><span
                            onClick={function(){e.stopPropagation(); angular.element(document.body).scope().sched.AddRem(self.assignedClass);}}>X</span></div>
                        <div className={"NeedAssc"}
                             title={"Registration is required for an associated section."}><b>!</b></div>
                        <span className={"SecName"}>{this.name}</span>
                    </div>
                </div>
    }


}

ReactDOM.render(<SchedGrid/>, document.querySelector("#SchedGrid_container"));