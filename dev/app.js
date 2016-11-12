// (function ($) {
$(function() {


var App = {};
App.Login = Backbone.Model.extend({
    urlRoot : 'http://localhost/api/auth',
    isAuth: 0,
    initialize: function() {}
});

App.LoginView = Backbone.View.extend({
    tagName: 'div',
    id: 'loginScreen',
    className: 'login-screen',
    template: $('#tpl-login-screen').html(),

    initialize: function() {
        $('#loginWrapper').html(this.el);
        this.render();
        var self = this;
        $('#loginScreen .submit').click(function() {
            var username, password;
            username = $('#loginScreen .login').val() || $('#loginScreen .login').css({'border-color': 'red'});
            password = $('#loginScreen .password').val() || $('#loginScreen .password').css({'border-color': 'red'});
            self.model.fetch({
                data: {username: username, password: password},
                type: 'post',
                url: 'http://localhost/api/login',
                success: function() {
                    $.cookie('api_login', self.model.get('login'), { experes: 365 });
                    $.cookie('api_key', self.model.get('password'), { experes: 365 });
                    $.cookie('username', self.model.get('username'), { experes: 365 });
                    $.cookie('exten', self.model.get('exten'), { experes: 365 });
                    self.remove();
                    App.router.navigate('', true);
                }
            })
        });
    },
    render: function() {
        var tpl = _.template( this.template );
        this.$el.html( tpl() );
        return this;
    },
});
var Contact = Backbone.Model.extend();

var Contacts = Backbone.Collection.extend({
    model: Contact,
    url: 'http://localhost/api/contacts'
});

var ContactViewList = Backbone.View.extend({
    tagName: 'tr',
    className: 'contact-line',
    template: $('#tpl-contact-line').html(),
    render: function() {
        var tpl = _.template( this.template );
        this.$el.html( tpl( this.model.toJSON() ) );
        return this;
    }
});
var ContactsViewList = Backbone.View.extend({
    tagName: 'table',
    tagClass: 'contacts-table',
    template: $('#tpl-contacts-list').html(),

    initialize: function() {
        $('#pageContent').html(this.el);
        this.collection = new Contacts();
        this.listenTo( this.collection, 'reset add change remove', this.render, this );
        var self = this;
        this.collection.fetch({
            data: {
                token: App.user.get('password')
            },
            type: 'post',
            error: function(model, xhr, options) {
                App.user.isAuth = false;
                App.router.navigate('login', {trigger: true});
            
            },
        }).done(function() {
            self.render(); 
        });
    },

    render: function() {
        var tpl = _.template( this.template );
        var that = this;
        this.$el.html( tpl() );
        _.each(this.collection.models, function(item) {
            that.renderContactList( item );
        }, this );
    },

    renderContactList: function( item ) {
        var contactViewList = new ContactViewList({
            model: item
        });
        $('#contactsViewList').append( contactViewList.render().el )
    }
});


var Call = Backbone.Model.extend();
var Calls = Backbone.Collection.extend({
    model: Call,
    url: 'http://localhost/api/calls'
});
var CallViewList = Backbone.View.extend({
    tagName: 'tr',
    className: 'call-line',
    template: $('#tpl-call-line').html(),
    render: function() {
        var tpl = _.template( this.template );
        this.$el.html( tpl( this.model.toJSON() ) );
        return this;
    },
    events: { 'click #playPause' : 'playPause'},

    playPause: function(that) {
        var audio = document.getElementById('player-'+this.model.id);
        audio.onended = function() {
            $(that.target).toggleClass('icon-control-pause');
        }
        $(that.target).toggleClass('icon-control-pause');
        return audio.paused ? audio.play() : audio.pause();
    }
});
var CallsViewList = Backbone.View.extend({
    tagName: 'table',
    tagClass: 'calls-table',
    template: $('#tpl-calls-list').html(),
    initialize: function() {
        $('#pageContent').html(this.el);
        this.collection = new Calls();
        var self = this;
        this.timer = setInterval(function() {
            self.collection.fetch({
                data: {
                    token: App.user.get('password')
                },
                type: 'post',
                error: function(model, xhr, options) {
                    App.user.isAuth = false;
                    App.router.navigate('login', {trigger: true});

                },
            }).done(function() {
                self.render(); 
            });
         }, 10000);
        this.listenTo( this.collection, 'reset add change remove', this.render, this );
        this.collection.fetch({
            data: {
                token: App.user.get('password')
            },
            type: 'post',
            error: function(model, xhr, options) {
                App.user.isAuth = false;
                App.router.navigate('login', {trigger: true});
            
            },
        }).done(function() {
            self.render(); 
        });
    },
    close: function() {
        clearInterval(this.timer);
    },
    render: function() {
        this.$el.html('');
        var tpl = _.template( this.template );
        var that = this;
        this.$el.html( tpl() );
        _.each(this.collection.models, function( item ) {
            that.renderCallList( item );
        }, this );
        return this;
    },
    renderCallList: function( item ) {
        var callViewList = new CallViewList({
            model: item
        });
        $('#callsViewList').append( callViewList.render().el );
    }
}); 



var Router = Backbone.Router.extend({
    routes: {
        ''      : 'index',
        'calls' : 'calls',
        'login' : 'login'
    },

    index: function() {
        this.loadView( new ContactsViewList() );

    },

    login: function() {
        this.loadView( new App.LoginView( { model: App.user } ) );
        if (this.view.model.isAuth) {
            this.navigate('', {trigger: true});
        }
    },

    calls: function() {
        this.loadView( new CallsViewList() );
    },

    loadView : function( view ) {
        this.view && this.view.remove();
        this.view = view;
    }
});

Backbone.history.start()
App.router = new Router();
App.user = new App.Login();

App.router.navigate('', {trigger: true});

if ( $.cookie('api_login') || $.cookie('api_key') || $.cookie('exten') || $.cookie('username') ) {
    App.user.fetch({
        type: 'post',
        data: { 
            api_login: $.cookie('api_login'),
            api_key: $.cookie('api_key')
        },
        error: function(model, xhr, options) {
            App.user.isAuth = false;
            App.router.navigate('login', {trigger: true});
            
        },
        success: function() {
            App.user.isAuth = true;
        }
    }).done(function() {
        if (App.user.isAuth) {
            App.router.view = new ContactsViewList();
            App.router.navigate('#', {trigger: true});
            } else {
                App.router.navigate('login', {trigger: true});
            }
        })
} else {
    App.router.navigate('login', {trigger: true});
}


})


// } (jQuery));