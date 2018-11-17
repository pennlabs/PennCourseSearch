'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sections = function (_React$Component) {
    _inherits(Sections, _React$Component);

    function Sections() {
        _classCallCheck(this, Sections);

        return _possibleConstructorReturn(this, (Sections.__proto__ || Object.getPrototypeOf(Sections)).apply(this, arguments));
    }

    return Sections;
}(React.Component);

var SectionList = function (_React$Component2) {
    _inherits(SectionList, _React$Component2);

    function SectionList() {
        _classCallCheck(this, SectionList);

        return _possibleConstructorReturn(this, (SectionList.__proto__ || Object.getPrototypeOf(SectionList)).apply(this, arguments));
    }

    return SectionList;
}(React.Component);

var SectionInfoDisplay = function (_React$Component3) {
    _inherits(SectionInfoDisplay, _React$Component3);

    function SectionInfoDisplay(props) {
        _classCallCheck(this, SectionInfoDisplay);

        var _this3 = _possibleConstructorReturn(this, (SectionInfoDisplay.__proto__ || Object.getPrototypeOf(SectionInfoDisplay)).call(this, props));

        _this3.sectionInfo = props.sectionInfo;
        return _this3;
    }

    _createClass(SectionInfoDisplay, [{
        key: 'render',
        value: function render() {}
    }]);

    return SectionInfoDisplay;
}(React.Component);