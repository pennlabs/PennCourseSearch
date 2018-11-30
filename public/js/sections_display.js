'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sectionsObj = null;

var Sections = function (_React$Component) {
    _inherits(Sections, _React$Component);

    function Sections(props) {
        _classCallCheck(this, Sections);

        var _this = _possibleConstructorReturn(this, (Sections.__proto__ || Object.getPrototypeOf(Sections)).call(this, props));

        _this.state = { sections: undefined, sectionInfo: undefined };
        _this.iteration = 0;
        return _this;
    }

    _createClass(Sections, [{
        key: "updateSections",
        value: function updateSections() {
            var $scope = angular.element(document.body).scope();
            this.setState(function (state) {
                return { sections: $scope.sections };
            });
        }
    }, {
        key: "updateSectionInfo",
        value: function updateSectionInfo() {
            var $scope = angular.element(document.body).scope();
            this.setState(function (state) {
                return { sectionInfo: $scope.sectionInfo };
            });
        }
    }, {
        key: "render",
        value: function render() {
            this.iteration++;
            sectionsObj = this;
            return React.createElement(
                "div",
                { id: "sectionsContainer" },
                React.createElement(
                    "div",
                    { className: "columns is-gapless",
                        style: { marginBottom: "0.6em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
                    React.createElement(
                        "div",
                        { className: "tooltip column is-one-fifth", title: "Section status (open or closed)" },
                        "O/C"
                    ),
                    React.createElement(
                        "div",
                        { className: "PCR Inst tooltip column is-one-fifth", title: "Instructor Quality rating",
                            style: { background: "rgba(46, 204, 113, 0.85)" } },
                        "Inst"
                    ),
                    React.createElement(
                        "div",
                        { className: "tooltip column is-one-fifth", title: "Section ID" },
                        "Sect"
                    ),
                    React.createElement(
                        "div",
                        { className: "tooltip column", title: "Meeting Time" },
                        "Time"
                    )
                ),
                React.createElement(
                    "div",
                    { id: "sections" },
                    this.state.sections && React.createElement(SectionList, { key: this.iteration, sections: this.state.sections }),
                    this.state.sectionInfo && React.createElement(SectionInfoDisplay, { key: this.iteration + 1, sectionInfo: this.state.sectionInfo })
                )
            );
        }
    }]);

    return Sections;
}(React.Component);

var SectionDisplay = function (_React$Component2) {
    _inherits(SectionDisplay, _React$Component2);

    function SectionDisplay(props) {
        _classCallCheck(this, SectionDisplay);

        var _this2 = _possibleConstructorReturn(this, (SectionDisplay.__proto__ || Object.getPrototypeOf(SectionDisplay)).call(this, props));

        _this2.section = _this2.props.section;
        _this2.getAddRemoveIcon = _this2.getAddRemoveIcon.bind(_this2);
        _this2.getPcaButton = _this2.getPcaButton.bind(_this2);
        _this2.getInstructorReview = _this2.getInstructorReview.bind(_this2);
        var $scope = angular.element(document.body).scope();
        var self = _this2;
        _this2.openSection = function () {
            $scope.get.SectionInfo(self.section.idDashed);
        };
        return _this2;
    }

    _createClass(SectionDisplay, [{
        key: "getAddRemoveIcon",
        value: function getAddRemoveIcon() {
            var className = "fa";
            var $scope = angular.element(document.body).scope();
            var self = this;
            var schedSections = $scope.schedSections;
            if (schedSections.indexOf(this.section.idDashed) === -1) {
                className += " fa-plus";
            } else if (schedSections.indexOf(this.section.idDashed) > -1) {
                className += " fa-times";
            }
            var onClick = function onClick() {
                $scope.sched.AddRem(self.section.idDashed);
            };
            return React.createElement("i", { className: className,
                onClick: onClick });
        }
    }, {
        key: "getPcaButton",
        value: function getPcaButton() {
            var $scope = angular.element(document.body).scope();
            var onClick = function onClick() {
                $scope.registerNotify(this.section.idDashed);
            };
            return React.createElement("i", { className: "fa fa-bell-o tooltip",
                onClick: onClick,
                title: "Penn Course Alert" });
        }
    }, {
        key: "getInstructorReview",
        value: function getInstructorReview() {
            var bgColor = "rgba(46, 204, 113," + this.section.pcrIShade + ")";
            return React.createElement(
                "span",
                { className: "PCR Inst",
                    style: { background: bgColor, color: this.section.pcrIColor },
                    onClick: this.openSection },
                this.section.revs.cI
            );
        }
    }, {
        key: "render",
        value: function render() {
            var $scope = angular.element(document.body).scope();
            var className = this.section.actType;
            if ($scope.currentSection === this.section.idSpaced.replace(' ', '').replace(' ', '')) {
                className += " activeItem";
            }
            if (!$scope.sched.SecOverlap(this.section) && $scope.schedSections.indexOf(this.section.idDashed) === -1) {
                className += "hideSec";
            }
            return React.createElement(
                "li",
                {
                    id: this.section.idDashed,
                    className: className },
                React.createElement(
                    "div",
                    { className: "columns is-gapless" },
                    React.createElement(
                        "div",
                        { className: "column is-one-fifth" },
                        this.getAddRemoveIcon(),
                        React.createElement("span", { className: "statusClass " + this.section.isOpen ? "openSec" : "closedSec",
                            onClick: this.openSection }),
                        !this.section.isOpen && this.getPcaButton()
                    ),
                    React.createElement(
                        "div",
                        { className: "column is-one-fifth" },
                        this.getInstructorReview()
                    ),
                    React.createElement(
                        "div",
                        { className: "column is-one-fifth", style: { marginLeft: "0.4rem" } },
                        React.createElement(
                            "span",
                            { className: "sectionText",
                                onClick: this.openSection },
                            $scope.justSection(this.section.idSpaced)
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "column" },
                        React.createElement(
                            "span",
                            { className: "sectionText",
                                onClick: this.openSection },
                            $scope.stripTime(this.section.timeInfo)
                        )
                    )
                )
            );
        }
    }]);

    return SectionDisplay;
}(React.Component);

var SectionList = function (_React$Component3) {
    _inherits(SectionList, _React$Component3);

    function SectionList(props) {
        _classCallCheck(this, SectionList);

        var _this3 = _possibleConstructorReturn(this, (SectionList.__proto__ || Object.getPrototypeOf(SectionList)).call(this, props));

        _this3.sections = props.sections;
        return _this3;
    }

    _createClass(SectionList, [{
        key: "render",
        value: function render() {
            var $scope = angular.element(document.body).scope();
            var sections = [];
            for (var i = 0; i < this.sections.length; i++) {
                var section = this.sections[i];
                if (($scope.showAct === section.actType || $scope.showAct === 'noFilter') && (section.isOpen || $scope.showClosed) && ($scope.currentCourse || $scope.starSections.indexOf(section.idDashed) > -1)) {
                    sections.push(React.createElement(SectionDisplay, { section: section, key: i }));
                }
            }

            return React.createElement(
                "div",
                { id: "SectionList" },
                React.createElement(
                    "ul",
                    null,
                    sections
                )
            );
        }
    }]);

    return SectionList;
}(React.Component);

var SectionInfoDisplay = function (_React$Component4) {
    _inherits(SectionInfoDisplay, _React$Component4);

    function SectionInfoDisplay(props) {
        _classCallCheck(this, SectionInfoDisplay);

        var _this4 = _possibleConstructorReturn(this, (SectionInfoDisplay.__proto__ || Object.getPrototypeOf(SectionInfoDisplay)).call(this, props));

        _this4.state = { sectionInfo: _this4.props.sectionInfo };
        return _this4;
    }

    _createClass(SectionInfoDisplay, [{
        key: "render",
        value: function render() {
            console.log("Rendering section info");
            var $scope = angular.element(document.body).scope();
            var timeInfoDisplay = undefined;
            if (this.state.sectionInfo.timeInfo) {
                var meetings = [];
                for (var i = 0; i < this.state.sectionInfo.timeInfo.length; i++) {
                    var meeting = meetings[i];
                    meetings.push(React.createElement(
                        "span",
                        { key: i },
                        meeting,
                        React.createElement("br", null)
                    ));
                }
                timeInfoDisplay = React.createElement(
                    "p",
                    { style: { display: "block" } },
                    meetings
                );
            }

            var requirementsDisplay = undefined;
            if (this.state.sectionInfo.reqsFilled) {
                var reqs = [];
                for (var _i = 0; _i < this.state.sectionInfo.reqsFilled.length; _i++) {
                    var req = this.state.sectionInfo.reqsFilled[_i];
                    reqs.push(React.createElement(
                        "span",
                        { key: _i },
                        req,
                        React.createElement("br", null)
                    ));
                }
                requirementsDisplay = React.createElement(
                    "span",
                    null,
                    " Requirements Fulfilled:",
                    React.createElement("br", null),
                    reqs,
                    React.createElement("br", null)
                );
            }

            var associatedSections = [];
            if (this.state.sectionInfo.associatedSections) {
                for (var _i2 = 0; _i2 < this.state.sectionInfo.associatedSections.length; _i2++) {
                    var associatedSection = this.state.sectionInfo.associatedSections[_i2];
                    associatedSections.push(React.createElement(
                        "li",
                        {
                            key: _i2,
                            id: associatedSection.replace(' ', '-').replace(' ', '-'),
                            onClick: function onClick() {
                                $scope.get.SectionInfo(associatedSections.replace(" ", "-").replace(' ', '-'));
                            } },
                        " ",
                        associatedSection,
                        " ",
                        React.createElement("br", null)
                    ));
                }
                associatedSections.push(React.createElement("br", { key: this.state.sectionInfo.associatedSections.length + 1 }));
            }

            return React.createElement(
                "div",
                { id: "SectionInfo" },
                this.state.sectionInfo.fullID && React.createElement(
                    "p",
                    { style: { fontSize: "1.25em" } },
                    this.state.sectionInfo.fullID + "-" + this.state.sectionInfo.title,
                    this.state.sectionInfo.associatedSections !== undefined && React.createElement("i", { style: { float: "right", marginRight: "2rem", color: "gold" },
                        className: "fa fa-star", onClick: function onClick() {
                            $scope.AddRem(currentSectionDashed);
                        } })
                ),
                timeInfoDisplay,
                this.state.sectionInfo.instructor && React.createElement(
                    "p",
                    null,
                    'Instructor: ' + this.state.sectionInfo.instructor,
                    React.createElement("br", null),
                    React.createElement("br", null)
                ),
                this.state.sectionInfo.associatedSections && associatedSections,
                this.state.sectionInfo.description && React.createElement(
                    "span",
                    null,
                    "Description: ",
                    this.state.sectionInfo.description,
                    " ",
                    React.createElement("br", null),
                    React.createElement("br", null)
                ),
                requirementsDisplay,
                this.state.sectionInfo.prereqs && React.createElement(
                    "span",
                    null,
                    " Prerequisites: ",
                    this.state.sectionInfo.prereqs,
                    " ",
                    React.createElement("br", null),
                    React.createElement("br", null)
                ),
                this.state.sectionInfo.associatedType && React.createElement(
                    "span",
                    null,
                    " You must also sign up for a ",
                    this.state.sectionInfo.associatedType,
                    ". ",
                    React.createElement("br", null),
                    " Associated ",
                    this.state.sectionInfo.associatedType,
                    "s: ",
                    React.createElement("br", null)
                ),
                React.createElement(
                    "ul",
                    null,
                    associatedSections
                )
            );
        }
    }]);

    return SectionInfoDisplay;
}(React.Component);

ReactDOM.render(React.createElement(Sections, null), document.querySelector("#SectionCol"));