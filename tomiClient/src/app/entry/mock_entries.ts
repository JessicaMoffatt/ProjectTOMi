//TODO REMOVE
import {Entry} from "../entry";
import {Component} from "@angular/core";

export const TEMPENTRIES: Entry[] = [
  {
    //change to project.getName. ie: remove this
    projectName: "Test Project",
    date: [ new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()],
    hours: [99.99,1,2.15,3,4,5,6],
    project: "Placeholder for Project object",
    task: "Developement Alpha",
    component: "Man Walking",
    quantity: 3,
    unitType: "Placeholder for Unit Type object"
  },
  {
    //change to project.getName. ie: remove this
    projectName: "Test Project 2",
    date: [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()],
    hours: [99.99,1,2.15,3,4,5,6],
    project: "Placeholder for Project object 2",
    task: "Developement Beta",
    component: "Man Walking 22",
    quantity: 3,
    unitType: "Placeholder for Unit Type object 2"
  }
];

