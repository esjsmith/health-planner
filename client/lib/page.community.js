// Creative Commons License. (c) 2013 pentasyllabic.com
// Attribution + Noncommercial + NoDerivatives
// http://creativecommons.org/licenses/by-nc-nd/3.0/


//--------------------------------------------------------------------
// set up commonly used helper functions

Template.communityPageTemplate.helpers(genericUserDisplayObject);
Template.communityInspectionColumn.helpers(genericUserDisplayObject);


//--------------------------------------------------------------------
// set up commonly used helpers


Template.communityPageTemplate.resize = function(){
    try{
        if(Session.get('show_sidebar_panel')){
            $('#communityInspectionBlock').css('width',window.innerWidth - 195);
            $('#communityInspectionBlock').css('left', (window.innerWidth - 195) * 0.05);
        }else{
            layoutAppWithoutSidebar();
        }
        return Session.get("appWidth");
    }catch(err){
        console.log(err);
    }
};
Template.communityPageTemplate.events({
    'click .destroy': function (evt, tmpl) {
        Meteor.users.update(Meteor.userId(), {$pull: { 'profile.collaborators': this }});
    },
    'keyup #communitySearchInput': function (evt, tmpl) {
        Session.set('community_members_filter', $('#communitySearchInput').val());
        Meteor.flush();
    },
    'click #communitySearchInput': function(evt,tmpl){
        if($('#communitySearchInput').val() === 'search community members'){
            $('#communitySearchInput').val('');
        }
    }
});


//--------------------------------------------------------------------
// communite inspection column (left column)

Template.communityInspectionColumn.showQuickViewPanel = function () {
    try{
        console.log('Template.communityPageTemplate.showQuickViewPanel');
        return Session.get('show_quick_view_panel');
    }catch(err){
        console.log(err);
    }
};
Template.communityInspectionColumn.rendered = function(){
    try{
        console.log("Template.communityInspectionColumn.rendered");
    }catch(err){
        console.log(err);
    }
};
Template.communityInspectionColumn.search_text_color = function(){
    try{
        if(Session.get('community_members_filter') === null){
            return "lightgray";
        }else{
            return "";
        }
    }catch(err){
        console.log(err);
    }
};


//--------------------------------------------------------------------
// quickViewPanelTemplate


Template.userQuickViewCard.user_id = function () {
    try{
        var user = Meteor.users.findOne({ _id: Session.get('selected_community_member') });
        if(user){
            return user._id;
        }else{
            return false;
        }
    }catch(err){
        console.log(err);
    }
};
Template.userQuickViewCard.user_name = function () {
    try{
        var user = Meteor.users.findOne({ _id: Session.get('selected_community_member') });
        return user.profile.name;
    }catch(err){
        console.log(err);
    }
};
Template.userQuickViewCard.user_email = function () {
    try{
        var user = Meteor.users.findOne({ _id: Session.get('selected_community_member') });
        if(user.emails){
            return user.emails.address;
        }

    }catch(err){
        console.log(err);
    }
};
Template.userQuickViewCard.user_avatar = function () {
    try{
        return Session.get('selected_community_member_avatar_path');
    }catch(err){
        console.log(err);
    }

};

//--------------------------------------------------------------------
// taskDetailCardTemplate



Template.communityInspectionColumn.isBroadcastRecipient = function(){
    try{
        var isRecipient = false;
        if(isRecipient){
            return "";
        }else{
            return "hidden";
        }
    }catch(err){
        console.log(err);
    }
};

Template.communityInspectionColumn.events({
    'touchmove #communityList' : function (e){
        e.preventDefault();
    },
    'click #userQuickViewPanel': function(evt){
        console.log('selected_community_member: ' + Session.get('selected_community_member'));
        setActiveCollaborator(Session.get('selected_community_member'));
        showPage("#profilePage");
        //Session.set('show_sidebar_panel',false);
    }
});


//--------------------------------------------------------------------
// communite inspection column (right column)

Template.communityMembersList.communityUsers = function () {
    return Meteor.users.find();
    //return Meteor.users.find({'emails.address': { $regex: Session.get('community_members_filter'), $options: 'i' } }, {sort: {'profile.name': 1}});
};

//--------------------------------------------------------------------
// userItemTemplate


Template.userItemTemplate.events({
    'dblclick .user-card': function () {
        // first we update the logged in user's profile
        // that they have shared their data with another person
        Meteor.users.update(Meteor.userId(), {$addToSet: { 'profile.carewatch' : {
            _id: this._id,
            name: this.profile.name
        }}});
        log_hipaa_event("Added " + this.profile.name + " to carewatch list.", LogLevel.Hipaa, Meteor.user()._id);

        // then we update the other person's profile
        // and notify them that they now have access to this persons profile
        Meteor.users.update(this._id, {$addToSet: { 'profile.collaborators': {
            _id: Meteor.userId(),
            name: Meteor.user().profile.name
        }}}, function(){
            Meteor.flush();
            hidePages();
            showPage('#communityPage');
        });
        log_hipaa_event("Permission granted to view health history belonging to " + Meteor.user().profile.name + ".", LogLevel.Hipaa, this._id);

    },
    'click .user-card': function (e) {
        e.preventDefault();
        Session.set('json_content', JSON.stringify(this));
        Session.set('selected_community_member', this._id);
        Session.set('show_quick_view_panel', true);

        if(this.services && this.services.facebook){
            Session.set('selected_community_member_avatar_path', "http://graph.facebook.com/" + this.services.facebook.id + "/picture/?type=large");
        }else if(this.profile){
            Session.set('selected_community_member_avatar_path', $.trim(this.profile.avatar));
        }else{
            Session.set('selected_community_member_avatar_path', "/images/placeholder-240x240.jpg");
        }
        Meteor.flush();
    },
    'click .transfer-icon': function (e) {
        setActiveCollaborator(this._id);
    }
});
Template.userItemTemplate.userEmail = function () {
    try{
        console.log('Template.userItemTemplate.userEmail');
        if(this.emails){
            return this.emails.address;
        }else{
            return 'Emails not available.';
        }
    }catch(err){
        console.log(err);
    }
};
Template.userItemTemplate.userName = function () {
    try{
        console.log('Template.userItemTemplate.userName');
        if(this.emails){
            return this.profile.name;
        }else{
            return 'User name not available.';
        }
    }catch(err){
        console.log(err);
    }
};
Template.userItemTemplate.userImage = function () {
    try{
        if(this.services && this.services.facebook){
            return "http://graph.facebook.com/" + this.services.facebook.id + "/picture/?type=large";
        }else if(this.profile){
            return $.trim(this.profile.avatar);
        }else{
            return "/images/placeholder-240x240.jpg";
        }
    }catch(error){
        console.log(err);
    }
};


//--------------------------------------------------------------------
//--------------------------------------------------------------------
// HELPER FUNCTIONS

toInteger = function(number){
    return Math.round(
        Number(number)
    );
};



//--------------------------------------------------------------------
// Toggles

setActiveCollaborator = function(selectedUserId) {
    try{
        Meteor.users.update(Meteor.userId(), {$unset:{ 'profile.activeCollaborator':'' }});
        Meteor.users.update(Meteor.userId(), {$set:{ 'profile.activeCollaborator':selectedUserId }});
    }catch(err){
        console.log(err);
    }
};
toggleActiveCollaborator = function(selectedUserId) {
    try{
        if (selectedUserId === Meteor.user().profile.activeCollaborator) {
            Meteor.users.update(Meteor.userId(), {$unset:{ 'profile.activeCollaborator': selectedUserId }});
        } else {
            setActiveCollaborator(selectedUserId);
        }
    }catch(err){
        console.log(err);
    }
};
toggleCollaboratorsMembership = function(selectedUserId) {
    try{
        if (selectedUserId === Meteor.user().profile.activeCollaborator) {
            Meteor.users.update(Meteor.userId(), {$unset:{ 'profile.activeCollaborator': selectedUserId }});
        } else {
            Meteor.users.update(Meteor.userId(), {$unset:{ 'profile.activeCollaborator':'' }});
            Meteor.users.update(Meteor.userId(), {$set:{ 'profile.activeCollaborator': selectedUserId }});
        }
    }catch(err){
        console.log(err);
    }
};
toggleCarewatchMembership = function(userId) {
    try{
        if (selectedUserId === Meteor.user().profile.activeCollaborator) {
            Meteor.users.update(Meteor.userId(), {$unset:{ 'profile.activeCollaborator': selectedUserId }});
        } else {
            Meteor.users.update(Meteor.userId(), {$unset:{ 'profile.activeCollaborator':'' }});
            Meteor.users.update(Meteor.userId(), {$set:{ 'profile.activeCollaborator': selectedUserId }});
        }
    }catch(err){
        console.log(err);
    }
};
