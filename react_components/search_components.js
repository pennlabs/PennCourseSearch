'use strict';

let searchResultsPane = null;

let offset = 0;

class SearchResults extends React.Component{

    constructor(props){
        super(props);
        this.state = {searchResults:[]};
        searchResultsPane = this;
    }

    render(){
        console.log("Re-rendering");
        let items = [];
        const $scope = angular.element(document.body).scope();
        for(let i = 0; i < this.state.searchResults.length; i++){
            const searchResult = this.state.searchResults[i];
            if(!((!$scope.checkArr[0] || searchResult.courseReqs.indexOf($scope.checkArr[0]) > -1) &&
                (!$scope.checkArr[1] || searchResult.courseReqs.indexOf($scope.checkArr[1]) > -1) &&
                (!$scope.checkArr[2] || searchResult.courseReqs.indexOf($scope.checkArr[2]) > -1) &&
                (!$scope.checkArr[3] || searchResult.courseReqs.indexOf($scope.checkArr[3]) > -1) &&
                (!$scope.checkArr[4] || searchResult.courseReqs.indexOf($scope.checkArr[4]) > -1))){
               continue;
            }
            const searchResultComponent = <SearchResult key={i + offset} course = {searchResult}>
            </SearchResult>;
            items.push(searchResultComponent);
        }
        offset += this.state.searchResults.length;
        return <ul>{items}</ul>
    }

    updateSearchResults(oldResults){
        let new_results = [];
        oldResults.forEach(item => {new_results.push(item)});
        let courseSort = angular.element(document.body).scope().courseSort;
        let tempCourseSort = courseSort.replace("-","");
        let scale = 1;
        if(tempCourseSort !== courseSort){
            scale = -1;
            courseSort = tempCourseSort;
        }
        courseSort = courseSort.replace("revs.","");
        if(courseSort === "idDashed") {
            this.setState(state => ({
                searchResults: new_results.sort((a, b) => {
                    if (a.idDashed > b.idDashed){
                        return 1;
                    }else if (a.idDashed < b.idDashed){
                        return -1;
                    }else{
                        return 0;
                    }
                })
            }));
            console.log(this.state.searchResults);
        }else{
            this.setState(state => ({
                searchResults: new_results.sort((a, b) => {
                    return scale * (a.revs[courseSort] - b.revs[courseSort])
                })
            }));
            console.log(this.state.searchResults);
        }
    }

}

const updateSearchResults = function(){
    const $scope = angular.element(document.body).scope();
    let results = $scope.courses;
    searchResultsPane.updateSearchResults(results);
};

class SearchResult extends React.Component{

    constructor(props){
        super(props);
        this.course = props.course;
    }

    render(){
        const $scope = angular.element(document.body).scope();
        return <li id={this.course.idDashed}
                   onClick={() => {$scope.get.Sections(this.course.idDashed);}}>

            <span className="PCR Qual"
                  style={{background:"rgba(45, 160, 240, "+this.course.pcrQShade+")",color: this.course.pcrQColor}}>
                {this.course.revs.cQT}
            </span>

            <span className = "PCR Diff"
                  style = {{background:"rgba(231, 76, 60, "+this.course.pcrDShade+")",color: this.course.pcrDColor}} >
                {this.course.revs.cDT}
            </span>

            <span className = "cID" >
                {this.course.idSpaced}
            </span>

            <span className = "cTitle" >
                {this.course.courseTitle}
            </span>

        </li>
    }

}

ReactDOM.render(<SearchResults/>, document.querySelector("#searchResultsContainer"));