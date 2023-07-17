import { Template } from 'meteor/templating';
import { TasksCollection } from "../db/TasksCollection";
import {ReportCollection} from "../db/ReportCollection";
import { ReactiveDict } from 'meteor/reactive-dict';

import './App.html';
import './Task/Task.js';
import './Report/Report.js';
import "./Login/Login.js";


const IS_LOADING_STRING = "isLoading";


//Meteor.subscribe('ServerPublication');

const HIDE_COMPLETED_STRING = "hideCompleted";
const EXPORTED_REPORT = true;


const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

const getTasksFilter = () => {
    const user = getUser();

    const hideCompletedFilter = { isChecked: { $ne: true } };

    const userFilter = user ? { userId: user._id } : {};

    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

    return { userFilter, pendingOnlyFilter };
}

const getExportByUserId = () => {
    const user = getUser();
    const userFilter = user ? { user_id: user._id } : {};
    return userFilter;
}


Template.mainContainer.onCreated(function mainContainerOnCreated() {
    this.tasksState = new ReactiveDict();
    this.reportState = new ReactiveDict();

    const tasksHandler = Meteor.subscribe('tasks');
    Tracker.autorun(() => {
        this.tasksState.set(IS_LOADING_STRING, !tasksHandler.ready());
    });

    const reportHandler = Meteor.subscribe('report');
    Tracker.autorun(() => {
        this.reportState.set(reportHandler.ready());
    });
});

Template.mainContainer.events({
    // "click #process-export-button"(event, instance) {
    //     const currentReportExported = instance.reportState.get(EXPORTED_REPORT);
    //     instance.reportState.set(EXPORTED_REPORT, !currentReportExported);
    // },
    'click .processExport'(events, instance) {
        events.preventDefault();
        // const reportsSelected = instance.$('.export-select');
        // get all instance of report that have the propert isChecked = true in the minimongo
        const reportsSelected = ReportCollection.find({ isChecked: true }).fetch();
        console.log(reportsSelected)
        reportsSelected.forEach(function ( report ) {
            Meteor.call('report.processExport', report._id);
        });
        // reportsSelected.map((report) => {
        //     Meteor.call('report.processExport', report._id, (error, result) => {
        //         if (error) {
        //             reject(error);
        //         } else {
        //             resolve(result);
        //         }
        //     });
        // });

        // Promise.all(promises).then((result) => {
        //     console.log('🎉: report ready to be extracted');
        // });
    },

    "click #hide-completed-button"(event, instance) {
        const currentHideCompleted = instance.tasksState.get(HIDE_COMPLETED_STRING);
        instance.tasksState.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
    },
    'click .user'() {
        Meteor.logout();
    }
});

Template.mainContainer.helpers({
    report() {
        const userFilter = getExportByUserId();
        if (!isUserLogged()) {
            return [];
        }
        const reportList = ReportCollection.find(userFilter, { sort: { createdAt: -1 } }).fetch();
        return reportList;
    },
    tasks() {
        const instance = Template.instance();
        const hideCompleted = instance.tasksState.get(HIDE_COMPLETED_STRING);

        const { pendingOnlyFilter, userFilter } = getTasksFilter();

        if (!isUserLogged()) {
            return [];
        }

        return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
            sort: { createdAt: -1 },
        }).fetch();
    },
    hideCompleted() {
        return Template.instance().tasksState.get(HIDE_COMPLETED_STRING);
    },
    incompleteCount() {
        if (!isUserLogged()) {
            return '';
        }

        const { pendingOnlyFilter } = getTasksFilter();

        const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count();
        return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
    },
    isUserLogged() {
        return isUserLogged();
    },
    getUser() {
        return getUser();
    },
    isLoading() {
        const instance = Template.instance();
        return instance.tasksState.get(IS_LOADING_STRING);
    }
});

Template.form.events({
    "submit .task-form"(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;

        // Insert a task into the collection
        Meteor.call('tasks.insert', text);

        // Clear form
        target.text.value = '';
    }
})