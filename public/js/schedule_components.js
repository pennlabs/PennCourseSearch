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
        _this.state = { schedBlocks: [], schedLines: [] };
        return _this;
    }

    _createClass(SchedGrid, [{
        key: "updateSchedLines",
        value: function updateSchedLines(schedLines) {
            this.setState(function (state) {
                return { schedLines: schedLines };
            });
        }
    }, {
        key: "updateSchedBlocks",
        value: function updateSchedBlocks(schedBlocks) {
            this.setState(function (state) {
                return { schedBlocks: schedBlocks };
            });
        }
    }, {
        key: "render",
        value: function render() {
            var lines = [];
            for (var i = 0; i < this.state.schedLines.length; i++) {
                lines.push(React.createElement(SchedLine, { key: i, y: this.state.schedLines[i] }));
            }
            var blocks = [];
            for (var _i = 0; _i < this.state.schedBlocks.length; _i++) {
                var block = this.state.schedBlocks[_i];
                blocks.push(React.createElement(SchedBlock, { topC: block.topC, id: block.id,
                    assignedClass: block.class, letterDay: block.letterday,
                    key: _i, y: block.top, x: block.left, width: block.width,
                    height: block.height, name: block.name }));
            }
            console.log(lines);
            return React.createElement(
                "div",
                { id: "SchedGrid" },
                blocks,
                lines
            );
        }
    }]);

    return SchedGrid;
}(React.Component);

var updateSchedLines = function updateSchedLines() {
    var schedLines = angular.element(document.body).scope().schedlines;
    schedGridRef.updateSchedLines(schedLines);
};

var updateSchedBlocks = function updateSchedBlocks() {
    var schedBlocks = angular.element(document.body).scope().schedBlocks;
    schedGridRef.updateSchedBlocks(schedBlocks);
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
        key: "render",
        value: function render() {
            return React.createElement("hr", { width: "99.7%", className: "schedline", style: { top: this.y + "%" } });
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
        return _this3;
    }

    _createClass(SchedBlock, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "SchedBlock_container " + this.letterDay + " " + this.topC,
                    style: { left: this.x + "%", top: this.y + "%", width: this.width + "%", height: this.height + "%" } },
                React.createElement(
                    "div",
                    { className: "SchedBlock " + this.letterday + " " + this.topC + " " + this.assignedClass, id: this.id,
                        onClick: function onClick() {
                            angular.element(document.body).scope().clearSearch();
                            angular.element(document.body).scope().initiateSearch(+this.assignedClass, 'courseIDSearch');
                        } },
                    React.createElement(
                        "div",
                        { className: "CloseX", style: { width: 100 + "%", height: 100 + "%" } },
                        React.createElement(
                            "span",
                            {
                                onClick: function onClick() {
                                    e.stopPropagation();angular.element(document.body).scope().sched.AddRem(thisBlock.class);
                                } },
                            "X"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "NeedAssc",
                            title: "Registration is required for an associated section." },
                        React.createElement(
                            "b",
                            null,
                            "!"
                        )
                    ),
                    React.createElement(
                        "span",
                        { className: "SecName" },
                        this.name
                    )
                )
            );
        }
    }]);

    return SchedBlock;
}(React.Component);

ReactDOM.render(React.createElement(SchedGrid, null), document.querySelector("#SchedGrid_container"));