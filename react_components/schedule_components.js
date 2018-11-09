'use strict';

class SchedGrid extends React.Component{

    constructor(props){
        super(props);
        this.state = {schedBlocks:[],schedLines:[]};
    }

    render(){
        const lines = [];
        //test of schedlines
        for(let i = 0; i < 10; i++){
            lines.push(<SchedLine key = {i} y = {i * 10}/>);
        }
        return <div id = {"SchedGrid"}>{lines}</div>;
    }
}

class SchedLine extends React.Component{

    constructor(props){
        super(props);
        this.y = props.y;
    }

    render(){
        return <hr width="99.7%" className="schedline" style={{top:this.y+"em"}}/>;
    }
}

ReactDOM.render(<SchedGrid/>, document.querySelector("#SchedGrid_container"));