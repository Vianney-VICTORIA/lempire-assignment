import { Template } from 'meteor/templating';
import './Report.html';

Template.report_file.events({
    'click .toggle-checked'(event) {
        this.oncheckBoxChange(event.target.checked);
    }
});

Template.report_file.helpers({
    // check if the export is in progress
    isExportInProgress(progress) {
        return progress > 0;
    }
})