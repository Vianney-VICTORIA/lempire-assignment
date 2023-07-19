import { Template } from 'meteor/templating';
import { ReportCollection } from "../../../db/ReportCollection";
import { ReactiveDict } from 'meteor/reactive-dict';
import '../../../api/reportMethods.js';
import '../../Components/Report/Report.js';
import '../Dashboard/Dashboard.js';
import '../Dashboard/Dashboard.html';

const getExportByUserId = () => {
    const user = Meteor.user();
    const userFilter = user ? { user_id: user._id } : {};
    return userFilter;
}

Template.dashboard.onCreated(function mainContainerOnCreated() {
    this.reportsData = new ReactiveDict();
    const reportHandler = Meteor.subscribe('report');
    Tracker.autorun(() => {
        this.reportsData.set('reportsData', reportHandler.ready());
    });
    this.checkedExports = new ReactiveDict();
});


Template.dashboard.events({
    'click .js-process-export'(events) {
        events.preventDefault();

        const checkedReports = Template.instance().checkedExports.all();

        const reportToProcess = Object.entries(checkedReports)
            .filter(([key, value]) => value === false)
            .map(([key, value]) => key);

        reportToProcess.forEach(function (report) {
            // TODO : resolve the promise to modify the checkedExports to unchecked in the ui
            Meteor.callAsync('report.processExport', report);
        });
    }
});

Template.dashboard.helpers({
    reportList() {
        const userFilter = getExportByUserId();
        const reportsByUserId = ReportCollection.find(userFilter, { sort: { createdAt: -1 } }).fetch();
        return reportsByUserId;
    },
    reportProps(report) {
        const instance = Template.instance();
        return {
            report,
            oncheckBoxChange(value) {
                if (value) {
                    instance.checkedExports.set(report._id, report.export_status)
                };
            }
        };
    }
});