'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var searchResultsPane = null;

var offset = 0;

var SearchResults = function (_React$Component) {
    _inherits(SearchResults, _React$Component);

    function SearchResults(props) {
        _classCallCheck(this, SearchResults);

        var _this = _possibleConstructorReturn(this, (SearchResults.__proto__ || Object.getPrototypeOf(SearchResults)).call(this, props));

        _this.state = { searchResults: [] };
        searchResultsPane = _this;
        return _this;
    }

    _createClass(SearchResults, [{
        key: "render",
        value: function render() {
            var items = [];
            var $scope = angular.element(document.body).scope();
            for (var i = 0; i < this.state.searchResults.length; i++) {
                var searchResult = this.state.searchResults[i];
                if (!((!$scope.checkArr[0] || searchResult.courseReqs.indexOf($scope.checkArr[0]) > -1) && (!$scope.checkArr[1] || searchResult.courseReqs.indexOf($scope.checkArr[1]) > -1) && (!$scope.checkArr[2] || searchResult.courseReqs.indexOf($scope.checkArr[2]) > -1) && (!$scope.checkArr[3] || searchResult.courseReqs.indexOf($scope.checkArr[3]) > -1) && (!$scope.checkArr[4] || searchResult.courseReqs.indexOf($scope.checkArr[4]) > -1))) {
                    continue;
                }
                var searchResultComponent = React.createElement(SearchResult, { key: i + offset, course: searchResult });
                items.push(searchResultComponent);
            }
            offset += this.state.searchResults.length;
            return React.createElement(
                "ul",
                null,
                items
            );
        }
    }, {
        key: "updateSearchResults",
        value: function updateSearchResults(oldResults) {
            var new_results = [];
            oldResults.forEach(function (item) {
                new_results.push(item);
            });
            var courseSort = angular.element(document.body).scope().courseSort;
            var tempCourseSort = courseSort.replace("-", "");
            var scale = 1;
            if (tempCourseSort !== courseSort) {
                scale = -1;
                courseSort = tempCourseSort;
            }
            courseSort = courseSort.replace("revs.", "");
            if (courseSort === "idDashed") {
                this.setState(function (state) {
                    return {
                        searchResults: new_results.sort(function (a, b) {
                            if (a.idDashed > b.idDashed) {
                                return 1;
                            } else if (a.idDashed < b.idDashed) {
                                return -1;
                            } else {
                                return 0;
                            }
                        })
                    };
                });
            } else {
                this.setState(function (state) {
                    return {
                        searchResults: new_results.sort(function (a, b) {
                            return scale * (a.revs[courseSort] - b.revs[courseSort]);
                        })
                    };
                });
            }
        }
    }]);

    return SearchResults;
}(React.Component);

var updateSearchResults = function updateSearchResults() {
    var $scope = angular.element(document.body).scope();
    var results = $scope.courses;
    searchResultsPane.updateSearchResults(results);
};

var SearchResult = function (_React$Component2) {
    _inherits(SearchResult, _React$Component2);

    function SearchResult(props) {
        _classCallCheck(this, SearchResult);

        var _this2 = _possibleConstructorReturn(this, (SearchResult.__proto__ || Object.getPrototypeOf(SearchResult)).call(this, props));

        _this2.course = props.course;
        return _this2;
    }

    _createClass(SearchResult, [{
        key: "render",
        value: function render() {
            var _this3 = this;

            var $scope = angular.element(document.body).scope();
            return React.createElement(
                "li",
                { id: this.course.idDashed,
                    onClick: function onClick() {
                        $scope.get.Sections(_this3.course.idDashed);
                    } },
                React.createElement(
                    "span",
                    { className: "PCR Qual",
                        style: { background: "rgba(45, 160, 240, " + this.course.pcrQShade + ")", color: this.course.pcrQColor } },
                    this.course.revs.cQT
                ),
                React.createElement(
                    "span",
                    { className: "PCR Diff",
                        style: { background: "rgba(231, 76, 60, " + this.course.pcrDShade + ")", color: this.course.pcrDColor } },
                    this.course.revs.cDT
                ),
                React.createElement(
                    "span",
                    { className: "cID" },
                    this.course.idSpaced
                ),
                React.createElement(
                    "span",
                    { className: "cTitle" },
                    this.course.courseTitle
                )
            );
        }
    }]);

    return SearchResult;
}(React.Component);

ReactDOM.render(React.createElement(SearchResults, null), document.querySelector("#searchResultsContainer"));