'use strict';


class Sections extends React.Component{

}

class SectionList extends React.Component{

}

class SectionInfoDisplay extends React.Component{
    constructor(props){
        super(props);
        this.sectionInfo = props.sectionInfo;
    }
    render(){
        let fullIDDisplay = undefined;
        if(this.sectionInfo.fullID){
            fullIDDisplay = <p style={{fontSize:"1.25em"}}>
                {(this.sectionInfo.fullID + "-" + this.sectionInfo.title)}

                <i style="float:right;margin-right:2rem;color:gold;"
                   ng-if="sectionInfo.associatedSections !== undefined" className="fa fa-star"
                   ng-class="{'fa-star': starSections.indexOf(currentSectionDashed) > -1, 'fa-star-o': starSections.indexOf(currentSectionDashed) === -1}"
                   ng-click="star.AddRem(currentSectionDashed)"></i>
            </p>;
        }

        return <div id="SectionInfo">
            {fullIDDisplay}
            <p ng-show="sectionInfo.timeInfo" style="display:block;"><span
                ng-repeat="meeting in sectionInfo.timeInfo"> {{meeting}} <br></span></p>
            <p ng-show="sectionInfo.instructor"> {{'Instructor: '+sectionInfo.instructor}} <br><br></p>
            <!-- <span ng-show="sectionInfo.sectionCred"> {{ sectionInfo.sectionCred }} CU <br><br></span> -->
            <br ng-if="sectionInfo.associatedSections === undefined"/>
            <span ng-show="sectionInfo.description">Description: {{sectionInfo.description}} <br><br></span>
            <span ng-show="sectionInfo.reqsFilled.length">Requirements Fulfilled: <br><span
                ng-repeat="req in sectionInfo.reqsFilled"> {{req}}<br></span>
				<br></span>
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