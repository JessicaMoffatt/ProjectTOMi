//TODO REMOVE
import {Entry} from "../../../model/entry";
import {Component} from "@angular/core";

export const TEMPENTRIES: Entry[] = [
  {
    approved: 1,
    //change to project.getName. ie: remove this
    projectName: "Test Project",
    date: [ new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()],
    hours: [99.75,1,2.25,3,4,5,6],
    project: "Placeholder for Project object",
    task: "Development Alpha",
    component: "Man Walking",
    quantity: 3,
    unitType: "Animation (Gold)",
    id: 1
  },
  {
    approved:2,
    //change to project.getName. ie: remove this
    projectName: "Test Project 2",
    date: [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()],
    hours: [99.25,10,3,5.5,2.75,3,9],
    project: "Placeholder for Project object 2",
    task: "Quality Assurance",
    component: "QA",
    quantity: 5,
    unitType: "QA Comments",
    id: 2
  }
];

