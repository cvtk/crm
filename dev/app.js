// (function ($) {

var App = {};
App.Login = Backbone.Model.extend({
    urlRoot : 'http://localhost/api/auth',
    isAuth: 0,
    initialize: function() {}
});

App.AccountView = Backbone.View.extend({
    tagName: 'div',
    className: 'account',
    template: $('#tpl-account').html(),
    initialize: function() {
    $('#pageContent').html(this.el);
    this.render();
    $('.menu-wrapper > .title').html( 'Аккаунт <span class="subtitle">здесь вы можете изменить свои личные данные</span>' );
    $('.menu-wrapper .search').hide();
    var self = this;
        
    },

    render: function() {
        var tpl = _.template( this.template );
        this.$el.html( tpl(this.model.toJSON()) );
        return this;
    },
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
                url: 'http://localhost/api/register',
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
                    $('.user-login > .login').html(App.user.get('username') || App.user.get('login'));
                    App.router.navigate('', true);
                },
                error: function(model, xhr) {
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

App.ContactViewCreate = Backbone.View.extend({
    tagName: 'div',
    className: 'contact-create',
    template: $('#tpl-contacts-create').html(),

    render: function() {
        var tpl = _.template( this.template );
        this.$el.html( tpl() );
        return this;
    },

    initialize: function() {
        var self = this;
        $('#newContact').click(function(){
            $(this).toggleClass('_toggled');
            self.$el.slideToggle();
        })
        $('#actionsWrapper').html(this.el);
        
        this.render();
    },

    events: {
        'click #saveContact': 'saveContact',
        'keypress': 'saveContact'

    },

    saveContact: function(e) {
        if(e.which == 13 || $(e.target).attr('id') == 'saveContact') {
            var name = $('#actionsWrapper input[name=name]').val(),
                phone = $('#actionsWrapper input[name=phone]').val(),
                family = $('#actionsWrapper input[name=phone]').val(),
                comment = $('#actionsWrapper input[name=phone]').val();
            if ( name.length == 0 ) {
                $('#actionsWrapper input[name=name]').addClass('_error')
            } else {
                $('#actionsWrapper input[name=name]').removeClass('_error');
                if ( phone.length == 0 ) {
                    $('#actionsWrapper input[name=phone]').addClass('_error');
                } else {
                    $('#actionsWrapper input[name=phone]').removeClass('_error');
                    $.ajax({
                        data: {
                            name: name,
                            phone: phone,
                            family: family,
                            comment: comment,
                            token: App.user.get('password')
                        },
                        type: 'post',
                        
                        url: 'http://localhost/api/contacts/add',

                        error: function() {
                            App.user.isAuth = false;
                            App.router.navigate('login', {trigger: true});
                        },

                        succeful: function(response) {
                        }
                    }).done(function(response) {
                        App.contactsViewList.collection.add(response);
                        $('#actionsWrapper input').each(function() {
                            $(this).val('');
                        }).first().focus();
                    })
                }
            }

            
        }
        
    }
})


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
    events: {'click thead td[data-sortby]': 'sortby',
             'click tbody td[data-phone]': 'addphone'
    },

    addphone: function(self) {
        var addphone = $(self.target).data('addphone');
        $('body').addClass('_hideCaller');
        $('#callerWidget .phonenumber').val(addphone);
    },

    sortby: function(self) {
        var sortby = $(self.target).data('sortby');
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
        }).done(function( obj ) {
            that.render(); 
        });
    },

    initialize: function() {
        $('.menu-wrapper .search').show();
        var self = this;
        $('#nextButton').unbind();
        $('#prevButton').unbind();
        $('#nextButton').click(function() {

            offset = $(this).data()['offset'] += 15;
            
            self.collection.fetch({
            data: {
                token: App.user.get('password'),
                offset: offset
            },
            type: 'post',
            error: function(model, xhr, options) {
                App.user.isAuth = false;
                App.router.navigate('login', {trigger: true});
            
            },
        }).done(function() {
            if ( $('tbody > tr').length < 15 ) {

            }
            self.render();
        });

        });
        $('#prevButton').click(function() {
            if ( $(this).data('offset') > 0 ) {
                this.fadeIn(350);
                offset = $(this).data()['offset'] += 15;
            
            self.collection.fetch({
            data: {
                token: App.user.get('password'),
                offset: offset
            },
            type: 'post',
            error: function(model, xhr, options) {
                App.user.isAuth = false;
                App.router.navigate('login', {trigger: true});
            
            },
        }).done(function() {

            self.render();
        });
            } else $(this).fadeOut(350);
            

        });
        $('.menu-wrapper > .title').html( 'Контакты <span class="subtitle">база с которой мы работаем</span>' );
        var self = this;
        $('.menu-wrapper > .search').unbind().keyup(function() {
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
            if ( $('tbody > tr').length < 15 ) {
            }
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
    url: 'http://localhost/api/calls',
    offset: 0,
    sortby: 'created',
    asc: 0,

    fetch: function(options) {
        console.log(this.asc);
        return Backbone.Collection.prototype.fetch.call(this, _.extend({
            data: {
                offset: this.offset,
                sortby: this.sortby,
                asc: this.asc,
                token: App.user.get('password')
            },
            type: 'post',
            error: function() {
                App.user.isAuth = false;
                App.router.navigate('login', {trigger: true});
            },
            success: function(response) {
            }
        }, options));
    }
});

var CallViewList = Backbone.View.extend({
    tagName: 'tr',
    className: 'call-line',
    template: $('#tpl-call-line').html(),

    render: function() {
        switch(this.model.get('disposition')) {
            case 'BUSY': this.model.set({'disposition': 'Занятость' });
                break;
            case 'ANSWERED': this.model.set({'disposition': 'Разговор' });
                break;
            case 'NO ANSWER': this.model.set({'disposition': 'Нет ответа' });
                break;
            case 'FAILED': this.model.set({'disposition': 'Ошибка на линии' });
                break;
        }
        var tpl = _.template( this.template );
            this.$el.html( tpl( this.model.toJSON() ) );
            return this;
        },
        events: { 
            'click td[data-phone]': 'addphone',
            'click #play': 'playcall'
        },
    
    playcall: function(self) {
        var id = $(self.target).data('id');
        var audio = document.getElementById(id);
        audio.addEventListener("ended", function(){
            audio.currentTime = 0;
                $(self.target).removeClass('_pause');
            });
        if ( audio.paused == false) {
            audio.pause();
            $(self.target).removeClass('_pause');
        } else {
            audio.play();
            $(self.target).addClass('_pause');
        }
    },

    addphone: function(that) {
        var phone = $(that.target).data('phone');
    },

});
var CallsViewList = Backbone.View.extend({
    tagName: 'table',
    className: 'calls-table',
    template: $('#tpl-calls-list').html(),

    events: {
        'click thead td[data-sortby]': 'sortby',
        
    },

    nextPage: function() {
        var self = this;
        this.collection.offset += 15;
        this.collection.fetch().done(function(response){
            if ( response.length < 15 ) {
                $('#nextButton').hide(0);
            } else { $('#prevButton').show(0); }
        });
    },
    prevPage: function() {
        if ( this.collection.offset <= 15 ) {
            this.collection.offset -= 15;
            this.collection.fetch();
            $('#prevButton').hide(0);
            $('#nextButton').show(0);
        } else {
            this.collection.offset -= 15;
            $('#nextButton').show(0);
            this.collection.fetch();
        }
    },

    sortby: function(event) {
        var sortby = this.collection.sortby,
            asc = this.collection.asc;
        if ( sortby == $(event.target).data('sortby') ) {
            this.collection.asc = asc? 0: 1;
            this.collection.fetch();
        } else {
            this.collection.asc = 0;
            this.collection.sortby = $(event.target).data('sortby');
            this.collection.fetch();  
        }
        
    },

    initialize: function() {
        this.collection = new Calls();
        this.listenTo( this.collection, 'reset add change remove', this.render, this );

        $('.menu-wrapper > .title').html( 'Мои звонки <span class="subtitle">входящие и исходящие звонки сотрудника</span>' );
        $('.menu-wrapper > .search').unbind().keyup(function() {
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
        var self = this;
        this.collection.fetch();

        this.unbind();
        $('.menu-wrapper .search').hide();
        $('#newContact').hide(0);
        $('#actionButton').hide(0);
        $('#nextButton').click(function(){
            self.nextPage();
        });
        $('#prevButton').click(function(){
            self.prevPage();
        });
    },

    render: function() {
        var tpl = _.template( this.template );
        var self = this;
        this.$el.html( tpl() );

        var sortby = this.collection.sortby,
            asc = this.collection.asc,
            $elem = this.$el.find("td[data-sortby='" + sortby + "']")
        $elem.toggleClass('_active');
        if ( asc ) { $elem.toggleClass('_asc') };

        _.each(this.collection.models, function( item ) {
            self.renderCallList( item );
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
        'register':'register',
        'account': 'account'
    },

    index: function() {
        this.loadView( App.contactsViewList = new ContactsViewList() );

    },
    account: function() {
        this.loadView( new App.AccountView ( { model: App.user } ) );
        if (!this.view.model.isAuth) {
            this.navigate('login', {trigger: true});
        }
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

App.user = new App.Login();

new App.ContactViewCreate;
if ( $.cookie('api_login') || $.cookie('api_key') ) {
    App.user.fetch({
        type: 'post',
        data: { 
            api_login: $.cookie('api_login'),
            api_key: $.cookie('api_key')
        },
        error: function(model, xhr, options) {
            App.user.isAuth = false;
            
        },
        success: function() {
            App.user.isAuth = true;
        }
    }).done(function() {
        App.router = new Router();
        Backbone.history.start();

        if (App.user.isAuth) {
            App.router.navigate(location.hash, true)
            $('.user-login > .login').html(App.user.get('username') || App.user.get('login'));
            // var url = window.location.hash;
            // App.router.navigate(url, {trigger: true});
            // App.router.view = new ContactsViewList();
            // App.router.navigate('', {trigger: true});
            } else {
                App.router.navigate('login', {trigger: true});
            }
        })
} else {
    App.router = new Router();
    Backbone.history.start();
    App.router.navigate('login', {trigger: true});
}


// })


// } (jQuery));