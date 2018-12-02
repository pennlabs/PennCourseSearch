'use strict';

let schedGridRef = null;

class SchedGrid extends React.Component {

    constructor(props) {
        super(props);
        schedGridRef = this;
        const defaultSchedData = props.schedData;
        this.state = {schedData: defaultSchedData};
    }

    updateSchedData(schedData){
        if(schedData) {
            this.setState(state => ({schedData: schedData}));
        }
    }

    render() {
        const courseSched = this.state.schedData.meetings;
        let weekdays = ['M', 'T', 'W', 'R', 'F'];
        let fullWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        let startHour = 10; // start at 10
        let endHour = 15; // end at 3pm
        let incSun = 0; // no weekends
        let incSat = 0;
        const self = this;
        if(courseSched) {
            courseSched.forEach(function (sec) {
                var secMeetHour = sec.meetHour;
                if (secMeetHour <= startHour) {
                    // If there are classes earlier than the default start
                    startHour = Math.floor(secMeetHour); // push back the earliest hour
                }
                if (secMeetHour + sec.hourLength >= endHour) {
                    // Push back latest hour if necessary
                    endHour = Math.ceil(secMeetHour + sec.hourLength);
                }
                if (sec.meetDay === 'U') {
                    // If there are sunday classes
                    incSun = 1;
                }
                if (sec.meetDay === 'S') {
                    // If there are saturday classes
                    incSat = 1;
                }
            });
        }

        if (incSun === 1) {
            weekdays.unshift('U');
            fullWeekdays.unshift('Sunday');
        } // Update weekdays array if necessary
        if (incSat === 1) {
            weekdays.push('S');
            fullWeekdays.push('Saturday');
        }
        let percentWidth = 100 / weekdays.length; // Update the block width if necessary
        let halfScale = 95 / (endHour - startHour + 1); // This defines the scale to be used throughout the scheduling process

        let timeblocks = [];
        let lines = [];
        if(courseSched) {
            if (courseSched.length) {
                for (let h = 0; h <= endHour - startHour; h++) {
                    // for each hour
                    let toppos = h * this.halfScale + 7.5; // each height value is linearly spaced with an offset
                    let hourtext = Math.round(h + startHour); // If startHour is not an integer, make it pretty
                    if (hourtext >= 12) {
                        if (hourtext !== 12) {
                            hourtext -= 12;
                        }
                        hourtext += "PM";
                    } else {
                        hourtext += "AM";
                    }
                    lines.push(<SchedLine key={h} y={toppos}/>);
                    timeblocks.push(hourtext);
                }
            }
        }
        // Define the color map
        var colorMap = {};
        var colorinc = 0;
        var colorPal = this.state.schedData.colorPalette;
        if(courseSched) {
            courseSched.forEach(function (sec) {
                var secID = sec.idDashed;
                if (!colorMap[secID]) {
                    colorMap[secID] = colorPal[colorinc];
                    colorinc++;
                }
            });
        }

        function GenMeetBlocks(sec) {
            var blocks = [];
            var meetLetterDay = sec.meetDay; // On which day does this meeting take place?
            var meetRoom = sec.meetLoc;
            var newid = sec.idDashed + '-' + meetLetterDay + sec.meetHour.toString().replace(".", "");
            var asscsecs = sec.SchedAsscSecs;

            var newblock = {
                'class': sec.idDashed,
                'letterday': meetLetterDay,
                'id': newid,
                'startHr': sec.meetHour,
                'duration': sec.hourLength,
                'name': sec.idSpaced,
                'room': meetRoom,
                'asscsecs': asscsecs,
                "topc": "blue"
            };
            blocks.push(newblock);
            return blocks;
        }

        var meetBlocks = [];
        let schedBlocks = [];
        // Add the blocks
        if(courseSched) {
            courseSched.forEach(function (sec) {
                meetBlocks = meetBlocks.concat(GenMeetBlocks(sec));
            });
        }

        function AddSchedAttr(block) {
            block.left = weekdays.indexOf(block.letterday) * percentWidth;
            block.top = (block.startHr - startHour) * halfScale + 9; // determine top spacing based on time from startHour (offset for prettiness)
            block.height = block.duration * halfScale;
            block.width = percentWidth;
            block.topc = generate_color(block.letterday, block.startHr, block.name);
            return block;
        }

        reset_colors();
        meetBlocks.forEach(function (b) {
            schedBlocks[b] = AddSchedAttr(b);
        });





        function TwoOverlap(block1, block2) {
            // Thank you to Stack Overflow user BC. for the function this is based on.
            // http://stackoverflow.com/questions/5419134/how-to-detect-if-two-divs-touch-with-jquery
            var y1 = (block1.startHr || block1.top);
            var h1 = (block1.duration || block1.height);
            var b1 = y1 + h1;

            var y2 = (block2.startHr || block2.top);
            var h2 = (block2.duration || block2.height);
            var b2 = y2 + h2;



            // This checks if the top of block 2 is lower down (higher value) than the bottom of block 1...
            // or if the top of block 1 is lower down (higher value) than the bottom of block 2.
            // In this case, they are not overlapping, so return false
            if (b1 <= (y2 + 0.0000001) || b2 <= (y1 + 0.0000001)) {
                return false;
            } else {
                return true;
            }
        }

        weekdays.forEach(function (weekday) {
            var dayblocks = schedBlocks.filter(function (n) {
                return n.letterday === weekday;
            });
            for (var i = 0; i < dayblocks.length - 1; i++) {
                for (var j = i + 1; j < dayblocks.length; j++) {
                    if (TwoOverlap(dayblocks[i], dayblocks[j])) {
                        dayblocks[i].width = dayblocks[i].width / 2;
                        dayblocks[j].width = dayblocks[j].width / 2;
                        dayblocks[j].left = dayblocks[j].left + dayblocks[i].width;
                    }
                }
            }
            schedBlocks.filter(function (n) {
                return n.letterday !== weekdays[weekday];
            });
            schedBlocks.concat(dayblocks);
        });



        let blocks = [];
        for (let i = 0; i < schedBlocks.length; i++) {
            const block = schedBlocks[i];
            let showWarning = angular.element(document.body).scope().sched.CrossCheck(block.asscsecs);
            blocks.push(<SchedBlock topC={block.topc} id={block.id}
                                    assignedClass={block.class} letterDay={block.letterday}
                                    key={i} y={block.top} x={block.left} width={block.width}
                                    height={block.height} name={block.name}
                                    showWarning={showWarning}/>);
        }
        if (blocks.length === 0) {
            return <div>
                <p style={{fontSize: "1.5em", marginTop: "7em", display: "block"}}>
                    Search for courses above <br/>then click a section's + icon to add it to the schedule.
                </p>
                <p style={{fontSize: "1em"}}>
                    These are mock schedules.
                    <br/>
                    You still need to register for your classes on Penn InTouch.
                </p>
            </div>
        } else {
            let weekdays = [];
            let $scope = angular.element(document.body).scope();
            const weekdayNames = $scope.fullWeekdays;
            for (let i = 0; i < weekdayNames.length; i++) {
                var weekday = weekdayNames[i];
                let label = <div key={i} className="DayName"
                                 style={{width: $scope.percentWidth + "%"}}>
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

const updateSchedule = function (schedData) {
    schedGridRef.updateSchedData(schedData);
};

const refreshSchedule = function () {
    schedGridRef.forceUpdate()
};

class SchedLine extends React.Component {

    constructor(props) {
        super(props);
        this.y = props.y;
    }

    render() {
        return <hr width="99.7%" className="schedline" style={{top: this.y + "%"}}/>;
    }
}

class SchedBlock extends React.Component {

    constructor(props) {
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

    render() {
        const self = this;
        let warning = <div className={"NeedAssc"}
                           title={"Registration is required for an associated section."}><b>!</b></div>;
        if (this.showWarning) {
            warning = null;
        }
        return <div className={"SchedBlock_container " + this.letterDay + " " + this.topC}
                    style={{left: this.x + "%", top: this.y + "%", width: this.width + "%", height: this.height + "%"}}>
            <div className={"SchedBlock " + this.letterDay + " " + this.topC + " " + this.assignedClass} id={this.id}
                 onClick={function () {
                     angular.element(document.body).scope().clearSearch();
                     angular.element(document.body).scope().initiateSearch(self.assignedClass, 'courseIDSearch');
                 }}>
                <div className={"CloseX"} style={{width: 100 + "%", height: 100 + "%"}}><span
                    onClick={function (e) {
                        e.stopPropagation();
                        angular.element(document.body).scope().sched.AddRem(self.assignedClass);
                    }}>X</span></div>
                {warning}
                <span className={"SecName"}>{this.name}</span>
            </div>
        </div>
    }


}

ReactDOM.render(<SchedGrid schedData ={[]}/>, document.querySelector("#Schedule"));