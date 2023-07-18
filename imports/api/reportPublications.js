import { Meteor } from 'meteor/meteor';
import { ReportCollection } from '/imports/db/ReportCollection';

Meteor.publish('report', function publishReport() {
    return ReportCollection.find({ user_id: this.userId });
});