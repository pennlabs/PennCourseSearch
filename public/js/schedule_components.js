'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var schedGridRef = null;

var SchedGrid = function (_React$Component) {
    _inherits(SchedGrid, _React$Component);

    function SchedGrid(props) {
        _classCallCheck(this, SchedGrid);

        var _this = _possibleConstructorReturn(this, (SchedGrid.__proto__ || Object.getPrototypeOf(SchedGrid)).call(this, props));

        schedGridRef = _this;
        var defaultSchedData = props.schedData;
        _this.state = { schedData: defaultSchedData };
        return _this;
    }

    _createClass(SchedGrid, [{
        key: 'updateSchedData',
        value: function updateSchedData(schedData) {
            if (schedData) {
                this.setState(function (state) {
                    return { schedData: schedData };
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var courseSched = this.state.schedData.meetings;
            var weekdays = ['M', 'T', 'W', 'R', 'F'];
            var fullWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            var startHour = 10; // start at 10
            var endHour = 15; // end at 3pm
            var incSun = 0; // no weekends
            var incSat = 0;
            var self = this;
            if (courseSched) {
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
            var percentWidth = 100 / weekdays.length; // Update the block width if necessary
            var halfScale = 95 / (endHour - startHour + 1); // This defines the scale to be used throughout the scheduling process

            var timeblocks = [];
            var lines = [];
            if (courseSched) {
                if (courseSched.length) {
                    for (var h = 0; h <= endHour - startHour; h++) {
                        // for each hour
                        var toppos = h * halfScale + 7.5; // each height value is linearly spaced with an offset
                        var hourtext = Math.round(h + startHour); // If startHour is not an integer, make it pretty
                        if (hourtext >= 12) {
                            if (hourtext !== 12) {
                                hourtext -= 12;
                            }
                            hourtext += "PM";
                        } else {
                            hourtext += "AM";
                        }
                        lines.push(React.createElement(SchedLine, { key: h, y: toppos }));
                        timeblocks.push(hourtext);
                    }
                }
            }
            // Define the color map
            var colorMap = {};
            var colorinc = 0;
            var colorPal = this.state.schedData.colorPalette;
            if (courseSched) {
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
            var schedBlocks = [];
            // Add the blocks
            if (courseSched) {
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
                schedBlocks.push(AddSchedAttr(b));
            });

            console.log(schedBlocks);

            function TwoOverlap(block1, block2) {
                // Thank you to Stack Overflow user BC. for the function this is based on.
                // http://stackoverflow.com/questions/5419134/how-to-detect-if-two-divs-touch-with-jquery
                var y1 = block1.startHr || block1.top;
                var h1 = block1.duration || block1.height;
                var b1 = y1 + h1;

                var y2 = block2.startHr || block2.top;
                var h2 = block2.duration || block2.height;
                var b2 = y2 + h2;

                // This checks if the top of block 2 is lower down (higher value) than the bottom of block 1...
                // or if the top of block 1 is lower down (higher value) than the bottom of block 2.
                // In this case, they are not overlapping, so return false
                if (b1 <= y2 + 0.0000001 || b2 <= y1 + 0.0000001) {
                    return false;
                } else {
                    return true;
                }
            }

            var newSchedBlocks = [];
            weekdays.forEach(function (weekday) {
                var dayblocks = [];
                schedBlocks.forEach(function (n) {
                    if (n.letterday.indexOf(weekday) !== -1) {
                        var newObj = JSON.parse(JSON.stringify(n));
                        n.letterday = weekday;
                        dayblocks.push(newObj);
                    }
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
                newSchedBlocks = newSchedBlocks.concat(dayblocks);
            });

            schedBlocks = newSchedBlocks;
            console.log(schedBlocks);

            var blocks = [];
            for (var i = 0; i < schedBlocks.length; i++) {
                var block = schedBlocks[i];
                var showWarning = angular.element(document.body).scope().sched.CrossCheck(block.asscsecs);
                blocks.push(React.createElement(SchedBlock, { topC: block.topc, id: block.id,
                    assignedClass: block.class, letterDay: block.letterday,
                    key: i, y: block.top, x: block.left, width: block.width,
                    height: block.height, name: block.name,
                    showWarning: showWarning }));
            }
            if (blocks.length === 0) {
                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'p',
                        { style: { fontSize: "1.5em", marginTop: "7em", display: "block" } },
                        'Search for courses above ',
                        React.createElement('br', null),
                        'then click a section\'s + icon to add it to the schedule.'
                    ),
                    React.createElement(
                        'p',
                        { style: { fontSize: "1em" } },
                        'These are mock schedules.',
                        React.createElement('br', null),
                        'You still need to register for your classes on Penn InTouch.'
                    )
                );
            } else {
                var _weekdays = [];
                var weekdayNames = fullWeekdays;
                for (var _i = 0; _i < weekdayNames.length; _i++) {
                    var weekday = weekdayNames[_i];
                    var label = React.createElement(
                        'div',
                        { key: _i, className: 'DayName',
                            style: { width: percentWidth + "%" } },
                        weekday
                    );
                    _weekdays.push(label);
                }
                return React.createElement(
                    'div',
                    null,
                    _weekdays,
                    React.createElement(
                        'div',
                        { id: "SchedGrid" },
                        lines,
                        blocks
                    )
                );
            }
        }
    }]);

    return SchedGrid;
}(React.Component);

var updateSchedule = function updateSchedule(schedData) {
    schedGridRef.updateSchedData(schedData);
};

var refreshSchedule = function refreshSchedule() {
    schedGridRef.forceUpdate();
};

var SchedLine = function (_React$Component2) {
    _inherits(SchedLine, _React$Component2);

    function SchedLine(props) {
        _classCallCheck(this, SchedLine);

        var _this2 = _possibleConstructorReturn(this, (SchedLine.__proto__ || Object.getPrototypeOf(SchedLine)).call(this, props));

        _this2.y = props.y;
        return _this2;
    }

    _createClass(SchedLine, [{
        key: 'render',
        value: function render() {
            return React.createElement('hr', { width: '99.7%', className: 'schedline', style: { top: this.y + "%" } });
        }
    }]);

    return SchedLine;
}(React.Component);

var SchedBlock = function (_React$Component3) {
    _inherits(SchedBlock, _React$Component3);

    function SchedBlock(props) {
        _classCallCheck(this, SchedBlock);

        var _this3 = _possibleConstructorReturn(this, (SchedBlock.__proto__ || Object.getPrototypeOf(SchedBlock)).call(this, props));

        _this3.y = props.y;
        _this3.x = props.x;
        _this3.width = props.width;
        _this3.height = props.height;
        _this3.letterDay = props.letterDay;
        _this3.topC = props.topC;
        _this3.id = props.id;
        _this3.assignedClass = props.assignedClass;
        _this3.name = props.name;
        _this3.showWarning = props.showWarning;
        return _this3;
    }

    _createClass(SchedBlock, [{
        key: 'render',
        value: function render() {
            var self = this;
            var warning = React.createElement(
                'div',
                { className: "NeedAssc",
                    title: "Registration is required for an associated section." },
                React.createElement(
                    'b',
                    null,
                    '!'
                )
            );
            if (this.showWarning) {
                warning = null;
            }
            return React.createElement(
                'div',
                { className: "SchedBlock_container " + this.letterDay + " " + this.topC,
                    style: { left: this.x + "%", top: this.y + "%", width: this.width + "%", height: this.height + "%" } },
                React.createElement(
                    'div',
                    { className: "SchedBlock " + this.letterDay + " " + this.topC + " " + this.assignedClass, id: this.id,
                        onClick: function onClick() {
                            angular.element(document.body).scope().clearSearch();
                            angular.element(document.body).scope().initiateSearch(self.assignedClass, 'courseIDSearch');
                        } },
                    React.createElement(
                        'div',
                        { className: "CloseX", style: { width: 100 + "%", height: 100 + "%" } },
                        React.createElement(
                            'span',
                            {
                                onClick: function onClick(e) {
                                    e.stopPropagation();
                                    angular.element(document.body).scope().sched.AddRem(self.assignedClass);
                                } },
                            'X'
                        )
                    ),
                    warning,
                    React.createElement(
                        'span',
                        { className: "SecName" },
                        this.name
                    )
                )
            );
        }
    }]);

    return SchedBlock;
}(React.Component);

ReactDOM.render(React.createElement(SchedGrid, { schedData: [] }), document.querySelector("#Schedule"));