import './App.html';
import './Layouts/Login/Login.js';
import './Layouts/Login/Login.html';
import '../ui/Layouts/Dashboard/Dashboard.js';
import './Layouts/Dashboard/Dashboard.html';
import {Template} from "meteor/templating";



const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

Template.mainContainer.helpers({
    isUserLogged() {
        return isUserLogged();
    }
});