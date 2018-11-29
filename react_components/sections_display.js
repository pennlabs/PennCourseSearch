'use strict';

let sectionsObj = null;

class Sections extends React.Component {

    constructor(props) {
        super(props);
        this.state = {sections: undefined, sectionInfo: undefined};
    }

    updateSections() {
        const $scope = angular.element(document.body).scope();
        this.setState(state => ({sections: $scope.sections}));
    }

    updateSectionInfo() {
        const $scope = angular.element(document.body).scope();
        this.setState(state => ({sectionInfo: $scope.sectionInfo}));
    }

    render() {
        sectionsObj = this;
        return <div id={"sectionsContainer"}>
            <div className="columns is-gapless"
                 style={{marginBottom: "0.6em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                <div className={"tooltip column is-one-fifth"} title={"Section status (open or closed)"}>O/C</div>
                <div className={"PCR Inst tooltip column is-one-fifth"} title={"Instructor Quality rating"}
                     style={{background: "rgba(46, 204, 113, 0.85)"}}>
                    Inst
                </div>
                <div className={"tooltip column is-one-fifth"} title={"Section ID"}>Sect</div>
                <div className={"tooltip column"} title={"Meeting Time"}>Time</div>
            </div>
            <div id={"sections"}>
                {this.state.sections && <SectionList sections={this.state.sections}/>}
                {this.state.sectionInfo && <SectionInfoDisplay sectionInfo={this.state.sectionInfo}/>}
            </div>
        </div>;
    }

}

class SectionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.section = this.props.section;
        this.getAddRemoveIcon = this.getAddRemoveIcon.bind(this);
        this.getPcaButton = this.getPcaButton.bind(this);
        this.getInstructorReview = this.getInstructorReview.bind(this);
        const $scope = angular.element(document.body).scope();
        this.openSection = function () {
            $scope.get.SectionInfo(this.section.idDashed);
        }
    }

    getAddRemoveIcon() {
        let className = "fa";
        const $scope = angular.element(document.body).scope();
        const schedSections = $scope.schedSections;
        if (schedSections.indexOf(this.section.idDashed) === -1) {
            className += "fa-plus";
        } else if (schedSections.indexOf(section.idDashed) > -1) {
            className += "fa-times";
        }
        const onClick = function () {
            $scope.sched.addRem(this.section.idDashed);
        };
        return <i className={className}
                  onClick={onClick}/>;
    }

    getPcaButton() {
        const $scope = angular.element(document.body).scope();
        const onClick = function () {
            $scope.registerNotify(this.section.idDashed);
        };
        return <i className={"fa fa-bell-o tooltip"}
                  onClick={onClick}
                  title="Penn Course Alert"/>;
    }

    getInstructorReview() {
        const bgColor = "rgba(46, 204, 113," + this.section.pcrIShade + ")";
        return <span className={"PCR Inst"}
                     style={{background: bgColor, color: this.section.pcrIColor}}
                     onClick={this.openSection}>{this.section.revs.cI}</span>;
    }

    render() {
        const $scope = angular.element(document.body).scope();
        return <li
            id={this.section.idDashed}
            className={this.section.actType}>
            <div className={"columns is-gapless"}>

                <div className={"column is-one-fifth"}>
                    {this.getAddRemoveIcon()}
                    <span className={"statusClass " + this.section.isOpen ? "openSec" : "closedSec"}
                          onClick={this.openSection}/>
                    {(!this.section.isOpen) && this.getPCAButton()}
                </div>

                <div className="column is-one-fifth">
                    {this.getInstructorReview()}
                </div>

                <div className={"column is-one-fifth"} style={{marginLeft: "0.4rem"}}>
                    <span className="sectionText"
                          onClick={this.openSection}>
                        {$scope.justSection(this.section.idSpaced)}
                    </span>
                </div>

                <div className={"column"}>
                    <span className={"sectionText"}
                          onClick={this.openSection}>
                        {stripTime(this.section.timeInfo)}
                    </span>
                </div>
            </div>
        </li>
    }
}

class SectionList extends React.Component {

    constructor(props) {
        super(props);
        this.sections = props.sections;
    }

    render() {
        const $scope = angular.element(document.body).scope();
        let sections = [];
        for (let i = 0; i < this.sections.length; i++) {
            let section = this.sections[i];
            if (($scope.showAct === section.actType || $scope.showAct === 'noFilter') &&
                (section.isOpen || $scope.showClosed) &&
                ($scope.currentCourse || $scope.starSections.indexOf(section.idDashed) > -1)) {
                sections.push(<SectionDisplay section={section} key={i}/>);
            }
        }

        return <div id="SectionList">
            <ul>
                {sections}
            </ul>
        </div>;
    }

}

class SectionInfoDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.sectionInfo = props.sectionInfo;
    }

    render() {
        const $scope = angular.element(document.body).scope();
        let timeInfoDisplay = undefined;
        if (this.sectionInfo.timeInfo) {
            let meetings = [];
            for (let i = 0; i < this.sectionInfo.timeInfo.length; i++) {
                let meeting = meetings[i];
                meetings.push(<span key={i}>
                    {meeting}
                    <br/>
                </span>);
            }
            timeInfoDisplay = <p style={{display: "block"}}>
                {meetings}
            </p>;
        }

        let requirementsDisplay = undefined;
        if (this.sectionInfo.reqsFilled) {
            const reqs = [];
            for (let i = 0; i < this.sectionInfo.reqsFilled.length; i++) {
                let req = this.sectionInfo.reqsFilled[i];
                reqs.push(<span key={i}>{req}<br/></span>);
            }
            requirementsDisplay = <span> Requirements Fulfilled:
                <br/>
                {reqs}
                <br/>
            </span>
        }

        let associatedSections = [];
        if(this.sectionInfo.associatedSections) {
            for (let i = 0; i < this.sectionInfo.associatedSections.length; i++) {
                let associatedSection = this.sectionInfo.associatedSections[i];
                associatedSections.push(<li
                    key = {i}
                    id={associatedSection.replace(' ', '-').replace(' ', '-')}
                    onClick={function () {
                        $scope.get.SectionInfo(associatedSections.replace(" ", "-").replace(' ', '-'));
                    }}> {associatedSection} <br/></li>);
            }
            associatedSections.push(<br key = {this.sectionInfo.associatedSections.length + 1}/>);
        }

        return <div id="SectionInfo">
            {this.sectionInfo.fullID && (<p style={{fontSize: "1.25em"}}>
                {(this.sectionInfo.fullID + "-" + this.sectionInfo.title)}
                ({(this.sectionInfo.associatedSections !== undefined) &&
                <i style={{float: "right", marginRight: "2rem", color: "gold"}}
                   className={"fa fa-star"} onClick={function () {
                    $scope.AddRem(currentSectionDashed)
                }
                }/>})
            </p>)}
            {timeInfoDisplay}
            {this.sectionInfo.instructor && <p>
                {'Instructor: ' + sectionInfo.instructor}
                <br/>
                <br/>
            </p>}
            {this.sectionInfo.associatedSections && associatedSections}
            {this.sectionInfo.description && <span>Description: {this.sectionInfo.description} <br/><br/></span>}
            {requirementsDisplay}
            {this.sectionInfo.prereqs && <span> Prerequisites: {this.sectionInfo.prereqs} <br/><br/></span>}
            {this.sectionInfo.associatedType &&
            <span> You must also sign up for a {this.sectionInfo.associatedType}. <br/> Associated {this.sectionInfo.associatedType}s: <br/></span>}
            <ul>
                {associatedSections}
            </ul>
        </div>
    }
}


ReactDOM.render(<Sections/>, document.querySelector("#SectionCol"));