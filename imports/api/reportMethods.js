import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReportCollection } from '../db/ReportCollection';

Meteor.methods({
    // 'report.insert'(text) {
    //     check(text, String);
    //
    //     if (!this.userId) {
    //         throw new Meteor.Error('Not authorized.');
    //     }
    //
    //     ReportCollection.insert({
    //         text,
    //         createdAt: new Date,
    //         userId: this.userId,
    //     })
    // },
    //
    // 'report.remove'(reportId) {
    //     check(reportId, String);
    //
    //     if (!this.userId) {
    //         throw new Meteor.Error('Not authorized.');
    //     }
    //
    //     const task = ReportCollection.findOne({ _id: reportId, userId: this.userId });
    //
    //     if (!task) {
    //         throw new Meteor.Error('Access denied.');
    //     }
    //
    //     ReportCollection.remove(reportId);
    // },
    //
    'report.setIsChecked'(reportId, isChecked) {
        check(reportId, String);
        check(isChecked, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const task = ReportCollection.findOne({ _id: reportId, user_id: this.userId });

        if (!task) {
            throw new Meteor.Error('Access denied.');
        }

        ReportCollection.update(reportId, {
            $set: {
                isChecked,
            },
        });
    },

    // create method to process export only if the user is logged in and the export belongs to the user and the export is not already processed and the export is checked
     async 'report.processExport'(reportId) {
        check(reportId, String);
        this.exports = new ReactiveVar([]);


        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const exportItem = ReportCollection.findOne({ _id: reportId, user_id: this.userId });

        if (exportItem && exportItem.export_status  === false) {
            return await new Promise((resolve) => {
                let progress = 0;
                const interval = Meteor.setInterval(() => {
                    progress += 5;
                    if (progress >= 100) {
                        progress = 100;
                        const url = getRandomUrl();
                        Meteor.clearInterval(interval);
                        ReportCollection.update(exportItem._id, {
                            $set: {
                                export_progress: progress,
                                export_link: url,
                                export_status: true,
                            }
                        });
                    } else {
                        ReportCollection.update(exportItem._id, {$set: {export_progress: progress}});
                    }
                }, 1000);
                resolve();
            });
            // let progress = 0;
            // const interval = setInterval(() => {
            //     progress += 5;
            //     if (progress >= 100) {
            //         progress = 100;
            //         const url = getRandomUrl();
            //         clearInterval(interval);
            //         ReportCollection.update(exportItem._id, {
            //             $set: {
            //                 progress: exportItem.progress,
            //                 export_link: url,
            //                 export_status: true,
            //                 isChecked: false,
            //             }
            //         });
            //     } else {
            //         ReportCollection.update(exportItem._id, {$set: {progress}});
            //     }
            // }, 1000);
        }
    }
});


/**
 * A function that will return a random link from the array of links.
 */
const getRandomUrl = function () {
    const links = ["https://www.lempire.com", "https://www.lemlist.com", "https://www.lemverse.com", "https://www.lemstash.com"];
    const random = Math.floor(Math.random() * links.length);
    return links[random];
}