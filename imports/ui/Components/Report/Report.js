import { Template } from 'meteor/templating';
import './Report.html';

Template.report_file.events({
    'click .toggle-checked'(event) {
        this.oncheckBoxChange(event.target.checked);
    }
});