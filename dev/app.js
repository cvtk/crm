// (function ($) {

var App = {};
App.Login = Backbone.Model.extend({
    urlRoot : 'http://localhost/api/auth',
    isAuth: 0,
    initialize: function() {}
});

App.AccountView = Backbone.View.extend({

})

App.RegisterView = Backbone.View.extend({
    tagName: 'div',
    id: 'registerScreen',
    className: 'register-screen',
    template: $('#tpl-register-screen').html(),

    initialize: function() {
        $('#loginWrapper').html(this.el);
        this.render();
        var self = this;
        $('#registerScreen .submit').click(function() {
            var login, password, name, exten, mobile, phone;
            login = $('#registerScreen .login').val() || $('#registerScreen .login').css({'border-color': 'red'});
            password = $('#registerScreen .password').val() || $('#registerScreen .password').css({'border-color': 'red'});
            name = $('#registerScreen .name').val() || $('#registerScreen .name').css({'border-color': 'red'});
            mobile = $('#registerScreen .mobile').val() || $('#registerScreen .mobile').css({'border-color': 'red'});
            $.ajax({
                type: 'post',
                url: 'http://127.0.0.1/api/register',
                data: {
                    login: login,
                    username: name,
                    password: password,
                    exten: $('#registerScreen .exten').val(),
                    phone: $('#registerScreen .phone').val(),
                    mobilephone: $('#callerWidget .mobile').val()
                },
                error: function(response) {
                    $('#registerScreen .result').html(response);

                },
                success: function(response) {
                    $('#loginScreen .result').html('Регистрация прошла успешно');
                    App.router.navigate('login', true);
                }
                }).done(function() {

                });

        });
    },
    render: function() {
        var tpl = _.template( this.template );
        this.$el.html( tpl() );
        return this;
    },
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
                    console.log(App.user.get('username') || App.user.get('login'));
                    $('.user-login > .login').html(App.user.get('username') || App.user.get('login'));
                    App.router.navigate('', true);
                },
                error: function(model, xhr) {
                    console.log(xhr.responseText);
                    $('#loginScreen .result').html(xhr.responseText);
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
    events: {'click thead td[data-sortby]': 'sortby'},

    sortby: function(self) {
        sortby = $(self).data();
        console.log(sortby);
    },

    initialize: function() {
        $('.main-bar > .title').html( 'Контакты <span class="subtitle">база с которой мы работаем</span>' );
        var self = this;
        $('.main-bar > .search').unbind().keyup(function() {
            if ($(this).val().length > 1)  {
                self.search($(this).val());
            } else {
                if ($(this).val().length == 0) {
                    $(this).unbind();
                    self.remove();
                    self.initialize();
            }
        }
        }).focus(function() { $(this).select() });

        $('#pageContent').html(this.el);
        this.collection = new Contacts();
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
    },

    search: function(search) {
        var self = this;
        this.collection.fetch({
            url: 'http://localhost/api/contacts/search',
            data: {
                token: App.user.get('password'),
                search: search,
            },
            type: 'post',
            error: function(model, xhr, options) {
                App.user.isAuth = false;
                App.router.navigate('login', {trigger: true});
            
            },
        }).done(function(obj) {
            self.render();
        });
    },
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
    state = this.model.get('state');
    switch(state) {
        case '7': state = 'Занятость';
            break;
        case '6': state = 'Ответ';
            break;
        case '5': state = 'Абонент не ответил';
            break;
        case '4': state = 'Вызов';
            break;
        default: state = 'Вызов';
            break;
    }
    this.model.set({'state': state })
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
    events: {'click thead td[data-sortby]': 'sortby'},

    sortby: function(self) {
        sortby = $(self.target).data('sortby');
        var that = this;
        this.collection.fetch({
            data: {
                token: App.user.get('password'),
                sortby: sortby
            },
            type: 'post',
            error: function(model, xhr, options) {
                App.user.isAuth = false;
                App.router.navigate('login', {trigger: true});
            
            },
        }).done(function() {
            that.render(); 
        });
    },
    search: function(search) {
        var self = this;
        this.collection.fetch({
            url: 'http://localhost/api/calls/search',
            data: {
                token: App.user.get('password'),
                search: search,
            },
            type: 'post',
            error: function(model, xhr, options) {
                App.user.isAuth = false;
                App.router.navigate('login', {trigger: true});
            
            },
        }).done(function(obj) {
            self.render();
        });
    },
    initialize: function() {
        var self = this;
        $('.main-bar > .title').html( 'Мои звонки <span class="subtitle">входящие и исходящие звонки сотрудника</span>' );
        $('.main-bar > .search').unbind().keyup(function() {
            if ($(this).val().length > 1)  {
                self.search($(this).val());
            } else {
                if ($(this).val().length == 0) {
                    $(this).unbind();
                    self.remove();
                    self.initialize();
            }
        }
        }).focus(function() { $(this).select() });

        $('#pageContent').html(this.el);
        this.collection = new Calls();
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
    close: function() {
        clearInterval(this.timer);
    },

    search: function(search) {
        var self = this;
        this.collection.fetch({
            data: {
                token: App.user.get('password'),
                search: search,
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
        'login' : 'login',
        'register':'register'
    },

    index: function() {
        this.loadView( new ContactsViewList() );

    },

    register: function() {
        this.loadView( new App.RegisterView( { model: App.user } ) );
        if (this.view.model.isAuth) {
            this.navigate('', {trigger: true});
        }
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
            $('.user-login > .login').html(App.user.get('username') || App.user.get('login'));
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


// })


// } (jQuery));