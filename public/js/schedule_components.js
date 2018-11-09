'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SchedGrid = function (_React$Component) {
    _inherits(SchedGrid, _React$Component);

    function SchedGrid(props) {
        _classCallCheck(this, SchedGrid);

        var _this = _possibleConstructorReturn(this, (SchedGrid.__proto__ || Object.getPrototypeOf(SchedGrid)).call(this, props));

        _this.state = { schedBlocks: [], schedLines: [] };
        return _this;
    }

    _createClass(SchedGrid, [{
        key: "render",
        value: function render() {
            var lines = [];
            //test of schedlines
            for (var i = 0; i < 10; i++) {
                lines.push(React.createElement(SchedLine, { key: i, y: i * 10 }));
            }
            return React.createElement(
                "div",
                { id: "SchedGrid" },
                lines
            );
        }
    }]);

    return SchedGrid;
}(React.Component);

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
            return React.createElement("hr", { width: "99.7%", className: "schedline", style: { top: this.y + "em" } });
        }
    }]);

    return SchedLine;
}(React.Component);

ReactDOM.render(React.createElement(SchedGrid, null), document.querySelector("#SchedGrid_container"));