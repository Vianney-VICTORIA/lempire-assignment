import { Template } from 'meteor/templating';
import '../Header/Header.html';

Template.header.events({
    'click .js-logout'() {
        Meteor.logout();
    }
});