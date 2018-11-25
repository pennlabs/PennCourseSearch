'use strict';


class Sections extends React.Component {

}

class SectionDisplay extends React.Component{
    constructor(props){
        super(props);
        this.section = this.props.section;
        this.getAddRemoveIcon = this.getAddRemoveIcon.bind(this);
        this.getClassStatus = this.getClassStatus.bind(this);
        this.getPcaButton = this.getPcaButton.bind(this);
    }

    getAddRemoveIcon(){
        let className = "fa";
        const $scope = angular.element(document.body).scope();
        const schedSections = $scope.schedSections;
        if(schedSections.indexOf(this.section.idDashed) === -1){
            className += "fa-plus";
        }else if (schedSections.indexOf(section.idDashed) > -1){
            className += "fa-times";
        }
        const onClick = function () {
          $scope.sched.addRem(this.section.idDashed);
        };
        return <i className={className}
                  onClick = {onClick}/>;
    }

    getClassStatus(){
        const $scope = angular.element(document.body).scope();
        const onClick = function(){
            $scope.get.SectionInfo(this.section.idDashed);
        };
        return <span className= {"statusClass "+this.section.isOpen?"openSec":"closedSec"}
              onClick={onClick}/>;
    }

    getPcaButton(){
        const $scope = angular.element(document.body).scope();
        const onClick = function(){
            $scope.registerNotify(this.section.idDashed);
        };
        return <i className={"fa fa-bell-o tooltip"}
           onClick={onClick}
           title="Penn Course Alert"/>;
    }

    render(){
        return <li
            id={this.section.idDashed}
            className={this.section.actType}>
            <div className={"columns is-gapless"}>
                <div className={"column is-one-fifth"}>
                    {this.getAddRemoveIcon()}
                    <!-- The icon should be a + if the section is not currently scheduled and an x if it is -->
                    {this.getClassStatus()}
                        <!-- the status square should be green if the section is open, red if it's closed -->
                    {(!this.section.isOpen) && this.getPCAButton()}
                        <!-- If the section is closed, show the notify icon -->
                </div>
                <div className="column is-one-fifth">
                                <span className="PCR Inst"
                                      style="background:rgba(46, 204, 113, {{ section.pcrIShade }});color: {{ section.pcrIColor }}"
                                      ng-click="get.SectionInfo(section.idDashed)">{{section.revs.cI | number:2}}</span>
                </div>
                <div className="column is-one-fifth" style="margin-left:0.4rem; ">
                                <span className="sectionText"
                                      ng-click="get.SectionInfo(section.idDashed)">{{justSection(section.idSpaced)}} </span>
                </div>
                <div className="column">
                                <span className="sectionText"
                                      ng-click="get.SectionInfo(section.idDashed)">{{stripTime(section.timeInfo)}} </span>
                </div>
            </div>
        </li>
    }
}

class SectionList extends React.Component {

    constructor(props){
        super(props);
        this.sections = props.sections;
    }

    render(){
        const $scope = angular.element(document.body).scope();
        let sections = [];
        for(let i = 0; i < this.sections.length; i++){
            let section = this.sections[i];
            if(($scope.showAct === section.actType || $scope.showAct === 'noFilter') &&
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
        const $scope = angular.element(document.body()).scope();
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
        for (let i = 0; i < this.sectionInfo.associatedSections.length; i++) {
            let associatedSection = this.sectionInfo.associatedSections[i];
            associatedSections.push(<li
                id={associatedSection.replace(' ', '-').replace(' ', '-')}
                onClick={function () {
                    $scope.get.SectionInfo(associatedSections.replace(" ", "-").replace(' ', '-'));
                }}> {associatedSection} <br/></li>);
        }

        return <div id="SectionInfo">
            {this.sectionInfo.fullID && <p style={{fontSize: "1.25em"}}>
                {(this.sectionInfo.fullID + "-" + this.sectionInfo.title)}
                {(this.sectionInfo.associatedSections !== undefined) &&
                <i style={{float: "right", marginRight: "2rem", color: "gold"}}
                   className={"fa fa-star"} onClick={function () {
                    $scope.AddRem(currentSectionDashed)
                }
                }/>}
            </p>}
            {timeInfoDisplay}
            {this.sectionInfo.instructor && <p>
                {'Instructor: ' + sectionInfo.instructor}
                <br/>
                <br/>
            </p>}
            {this.sectionInfo.associatedSections && <br/>}
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