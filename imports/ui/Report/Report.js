import { Template } from 'meteor/templating';
import '../Report/Report.html';

Template.report_file.events({
    'click .toggle-checked'() {
        Meteor.call('report.setIsChecked', this._id, !this.isChecked);
    },
    'click .delete'() {
        Meteor.call('report.remove', this._id);
    }
});