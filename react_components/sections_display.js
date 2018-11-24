'use strict';


class Sections extends React.Component {

}

class SectionList extends React.Component {

}

class SectionInfoDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.sectionInfo = props.sectionInfo;
    }

    render() {
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

        return <div id="SectionInfo">
            {this.sectionInfo.fullID && <p style={{fontSize: "1.25em"}}>
                {(this.sectionInfo.fullID + "-" + this.sectionInfo.title)}
                {(this.sectionInfo.associatedSections !== undefined) &&
                <i style={{float: "right", marginRight: "2rem", color: "gold"}}
                   className={"fa fa-star"} onClick={function () {
                    angular.element(document.body()).scope().AddRem(currentSectionDashed)
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
            {this.sectionInfo.reqsFilled.length && <span> Requirements Fulfilled: <br><span
                ng-repeat="req in sectionInfo.reqsFilled"> {{req}}<br/></span>
				<br/></span>}
            <span ng-show="sectionInfo.prereqs"> Prerequisites: {{sectionInfo.prereqs}} <br><br></span>
            <span
                ng-show="sectionInfo.associatedType"> You must also sign up for a {{sectionInfo.associatedType}}. <br> Associated {{sectionInfo.associatedType}}s: <br></span>
            <ul>
                <li ng-repeat="asscSec in sectionInfo.associatedSections"
                    id="{{asscSec.replace(' ', '-').replace(' ', '-')}}"
                    ng-click="get.SectionInfo(asscSec.replace(' ', '-').replace(' ', '-'))"> {{asscSec}} <br></li>
            </ul>
        </div>
    }
}

}