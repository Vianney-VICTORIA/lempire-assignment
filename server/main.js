import { Meteor } from 'meteor/meteor';
import { ReportCollection } from "../imports/db/ReportCollection";
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/reportPublications';
import '/imports/api/reportMethods';
import data from '../imports/db/data.json';


const SEED_USERNAME = 'lempire';
const SEED_PASSWORD = 'root';

Meteor.startup(() => {
    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
        Accounts.createUser({
            username: SEED_USERNAME,
            password: SEED_PASSWORD,
        });
    }
    const user = Accounts.findUserByUsername(SEED_USERNAME);

    // if there is no export in the database, insert the data from the json file
    if (ReportCollection.find().count() === 0) {
        data.forEach(report => insertReport(report, user));
    }
});


const insertReport = (report, user) =>
    ReportCollection.insert({
        user_id: user._id,
        export_name: report.export_name,
        export_link: report.export_link,
        export_status: report.export_status,
        progress: report.progress,
        created_at: report.created_at,
    });