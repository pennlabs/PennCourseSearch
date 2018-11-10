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
        if(schedBlocks !== null && schedBlocks !== undefined) {
            this.setState(state => ({schedBlocks: schedBlocks}));
        }
    }

    render(){
        let lines = [];
        for(let i = 0; i < this.state.schedLines.length; i++){
            lines.push(<SchedLine key = {i} y = {this.state.schedLines[i]}/>);
        }
        let blocks = [];
        for(let i = 0; i < this.state.schedBlocks.length; i++){
            const block = this.state.schedBlocks[i];
            let showWarning = angular.element(document.body).scope().sched.CrossCheck(block.asscsecs);
            blocks.push(<SchedBlock topC={block.topc} id ={block.id}
                                    assignedClass={block.class} letterDay={block.letterday}
                                    key = {i} y={block.top} x={block.left} width ={block.width}
                                    height = {block.height} name = {block.name}
                                    showWarning = {showWarning}/>);
        }
        console.log(lines);
        if(blocks.length === 0){
            return <div>
                    <p style={{fontSize:"1.5em",marginTop:"7em",display:"block"}}>
                        Search for courses above <br/>then click a section's + icon to add it to the schedule.
                    </p>
                    <p style={{fontSize:"1em"}}>
                        These are mock schedules.
                        <br/>
                        You still need to register for your classes on Penn InTouch.
                    </p>
            </div>
        }else {
            let weekdays = [];
            let $scope = angular.element(document.body).scope();
            const weekdayNames = $scope.fullWeekdays;
            for(let i = 0; i < weekdayNames.length; i++){
                var weekday = weekdayNames[i];
                let label = <div key = {i} className="DayName"
                                 style={{width:$scope.percentWidth+"%"}}>
                    {weekday}
                </div>;
                weekdays.push(label);
            }
            return <div>
                {weekdays}
                <div id={"SchedGrid"}>{lines}{blocks}</div>
            </div>;
        }
    }
}

const updateSchedule = function(){
    const schedLines = angular.element(document.body).scope().schedlines;
    schedGridRef.updateSchedLines(schedLines);
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
        this.showWarning = props.showWarning;
    }

    render(){
        const self = this;
        let warning = <div className={"NeedAssc"}
                           title={"Registration is required for an associated section."}><b>!</b></div>;
       if(this.showWarning){
           warning = null;
       }
        return<div className = {"SchedBlock_container "+this.letterDay+" "+this.topC}
                    style = {{left:this.x+"%",top:this.y+"%",width:this.width+"%",height:this.height+"%"}}>
                    <div className={"SchedBlock " +this.letterDay+" "+ this.topC+" "+this.assignedClass} id = {this.id}
                         onClick={function(){angular.element(document.body).scope().clearSearch();
                                  angular.element(document.body).scope().initiateSearch(self.assignedClass, 'courseIDSearch');}}>
                        <div className={"CloseX"} style={{width:100+"%",height:100+"%"}}><span
                            onClick={function(e){e.stopPropagation(); angular.element(document.body).scope().sched.AddRem(self.assignedClass);}}>X</span></div>
                        {warning}
                        <span className={"SecName"}>{this.name}</span>
                    </div>
                </div>
    }


}

ReactDOM.render(<SchedGrid/>, document.querySelector("#Schedule"));