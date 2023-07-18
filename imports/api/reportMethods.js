import { check } from 'meteor/check';
import { ReportCollection } from '../db/ReportCollection';

Meteor.methods({
     async 'report.processExport'(reportId) {
        check(reportId, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const exportItem = ReportCollection.findOne({ _id: reportId, user_id: this.userId });

        if (exportItem && exportItem.progress === 0 ) {
            return await new Promise((resolve) => {
                let progress = 0;
                if(Meteor.isServer) {
                    const interval = Meteor.setInterval(() => {
                        progress += 5;
                        if (progress >= 100) {
                            progress = 100;
                            const url = getEmpireUrl();
                            Meteor.clearInterval(interval);
                            ReportCollection.update(exportItem._id, {
                                $set: {
                                    progress: progress,
                                    export_link: url,
                                    export_status: true,
                                }
                            });
                        } else {
                            ReportCollection.update(exportItem._id, {$set: {progress: progress}});
                        }
                    }, 1000);
                }
                resolve();
            });
        }
    }
});


const getEmpireUrl = () =>{
    const EmpireUrls = [
        "https://www.lempire.com",
        "https://www.lemlist.com",
        "https://www.lemverse.com",
        "https://www.lemstash.com"
    ];
    const randomIndex = Math.floor(Math.random() * EmpireUrls.length);
    return EmpireUrls[randomIndex];
}