// Creative Commons License. (c) 2013 pentasyllabic.com
// Attribution + Noncommercial + NoDerivatives
// http://creativecommons.org/licenses/by-nc-nd/3.0/


Template.guestPageTemplate.rendered = function(){
    log_event("Template.guestPageTemplate.rendered",LogLevel.Signpost,this);
};
Template.guestPageTemplate.events({
    'click .synopsis-tab': function(){
        $('.card-container').addClass('hidden');
        $('.synopsis').removeClass('hidden');
        $('#currentScreenshotContainer').removeClass('hidden');
    },
    'click .features-tab': function(){
        $('.card-container').addClass('hidden');
        $('.features').removeClass('hidden');
    },
//    'click .vision-tab': function(){
//        $('.card-container').addClass('hidden');
//        $('.vision').removeClass('hidden');
//        $('#currentScreenshotContainer').addClass('hidden');
//    },
//    'click .roadmap-tab': function(){
//        $('.card-container').addClass('hidden');
//        $('.vision').addClass('hidden');
//        $('.roadmap').removeClass('hidden');
//    },
    'click .eula-tab': function(){
        $('.card-container').addClass('hidden');
        $('.eula').removeClass('hidden');
    },
    'click .privacy-tab': function(){
        $('.card-container').addClass('hidden');
        $('.privacy-policy').removeClass('hidden');
    },

    'click .accounts-tab': function(){
        $('.card-container').addClass('hidden');
        $('.accounts').removeClass('hidden');
    },
    'click .betatest-tab': function(){
        $('.card-container').addClass('hidden');
        $('.betatest').removeClass('hidden');
    },
    'click .all-tab': function(){
        $('.card-container').removeClass('hidden');
    }
//    ,
//    'click .moneyShot': function(){
//        showImageOverlay('#day-of-glass-money-shot-34ratio');
//    },
//    'click #currentScreenshot': function(){
//        showImageOverlay('#currentScreenshotImage');
//    }
});

