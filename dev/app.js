// (function ($) {

var App = {};
App.Login = Backbone.Model.extend({
    url : '/api/auth',
    isAuth: false,
    api_login: '',
    api_key: '',
    
    fetch: function(options) {
        return Backbone.Model.prototype.fetch.call(this, _.extend({
            data: {
                api_login: this.api_login,
                api_key: this.api_key
            },
            type: 'post',
            error: function() {
                this.isAuth = false;
            },
            success: function(response) {
                this.isAuth = true;
            }
        }, options));
    },

    initialize: function() {
        if ( $.cookie('api_login') && $.cookie('api_key') ) {
            this.api_login = $.cookie('api_login');
            this.api_key = $.cookie('api_key');
        } else {
            return false;
        }
    }
});

App.AccountView = Backbone.View.extend({
    tagName: 'div',
    className: 'account',
    template: $('#tpl-account').html(),
    initialize: function() {
    var self = this;
    $('#pageContent').html(this.el);
    $('.menu-wrapper > .title').html( 'Учетная запись <span class="subtitle">здесь вы можете изменить свои личные данные</span>' );
    this.unbind();
    $('.menu-wrapper .search').hide();
    $('#newContact').hide(0);
    $('#actionButton').hide(0);
    $('#nextButton').hide(0);
    $('#prevButton').hide(0);
    $('.contact-create').hide(0);
    

    $('.main-bar > .menu-wrapper').append('<button class="logout" title="Выйти из учетной записи">Выйти<span class="icon"></span></button>');
    $('.main-bar > .menu-wrapper > .logout').click(function() {
        $.cookie("api_key", null, { path: '/' });
        $.cookie("api_login", null, { path: '/' });
        App.user.isAuth = false;
        App.router.navigate('login', {trigger: true});
    })

    $('.main-bar > .menu-wrapper').append('<button class="save" title="Сохранить изменения">Сохранить<span class="icon"></span></button>');
    $('.main-bar > .menu-wrapper > .save').click(function() {
        $.ajax({
            url: '/api/account/change',
            type: 'post',
            data: {
                login: App.user.get('login'),
                token: App.user.get('password'),
                username: self.$el.find('.name').val(),
                exten: self.$el.find('.exten').val(),
                phone: self.$el.find('.phone').val(),
                mobilephone: self.$el.find('.mobile').val()
            },
            success: function() {
                App.router.navigate('', {trigger: true});
                self.model.fetch().done(function() {
                    $('.user-login > .login').html(App.user.get('username') || App.user.get('login'));
                });
                
            },
            error: function(opt, xhr) {
                console.loq('errr');
            }
        })

    });

    this.listenTo( this, 'reset remove', this.remove, this );
    this.render();

    },
    remove: function() {
        this.unbind();
        $('.main-bar > .menu-wrapper > .save').remove();
        $('.main-bar > .menu-wrapper > .logout').remove();
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
                url: '/api/register',
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
        $('#loginWrapper').html(this.el).keyup(function(e) {
            if ( e.which == 13 ) {
                $('#loginScreen .submit').trigger('click');
            }
        });
        this.render();
        var self = this;
        $('#loginScreen .submit').click(function() {
            var username, password;
            username = $('#loginScreen .login').val() || $('#loginScreen .login').css({'border-color': 'red'});
            password = $('#loginScreen .password').val();
            self.model.fetch({
                data: {username: username, password: password},
                type: 'post',
                url: '/api/login',
                success: function() {
                    $.cookie('api_login', self.model.get('login'), { experes: 365 });
                    $.cookie('api_key', self.model.get('password'), { experes: 365 });
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
        'click #closeContact': 'closeContact',
        'click #saveContact': 'saveContact',
        'keypress': 'saveContact',
        'keyup': 'closeContact'

    },
    closeContact: function(e) {
        if(e.which == 27 || $(e.target).attr('id') == 'closeContact') {
            console.log('joi');
            $('#newContact').toggleClass('_toggled');
            this.$el.slideToggle();
        }
    },
    saveContact: function(e) {
        
        if(e.which == 13 || $(e.target).attr('id') == 'saveContact') {
            var name = $('#actionsWrapper input[name=name]').val(),
                phone = $('#actionsWrapper input[name=phone]').val(),
                family = $('#actionsWrapper input[name=family]').val(),
                comment = $('#actionsWrapper input[name=comment]').val();
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
                        
                        url: '/api/contacts/add',

                        error: function() {
                            App.user.isAuth = false;
                            App.router.navigate('login', {trigger: true});
                        },

                        succeful: function(response) {
                        }
                    }).done(function(response) {
                        App.router.view.collection.fetch();
                        $('#actionsWrapper input').each(function() {
                            $(this).val('');
                        }).first().focus();
                    })
                }
            }

            
        }
        
    }
})

var Contacts = Backbone.Collection.extend({
    model: Contact,
    url: '/api/contacts',
    offset: 0,
    sortby: 'id',
    asc: 0,
    search: '',

    fetch: function(options) {
        return Backbone.Collection.prototype.fetch.call(this, _.extend({
            data: {
                offset: this.offset,
                sortby: this.sortby,
                asc: this.asc,
                search: this.search,
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

var ContactViewList = Backbone.View.extend({
    tagName: 'tr',
    className: 'contact-line',
    template: $('#tpl-contact-line').html(),
    events: { 'click td[data-phone]': 'callTo' },

    callTo: function(event) {
        var phone = $(event.target).data('phone');

        if ( $('body').hasClass('_hideCaller') ) { $('body').toggleClass('_hideCaller') }
        $('#callerWidget .phonenumber').val(phone).focus();
    },
    render: function() {
        var tpl = _.template( this.template );
        this.$el.html( tpl( this.model.toJSON() ) );
        return this;
    }
});
var ContactsViewList = Backbone.View.extend({
    tagName: 'table',
    className: 'contacts-table',
    template: $('#tpl-contacts-list').html(),
    events: { 'click thead td[data-sortby]': 'sortby' },

    nextPage: function() {
        var self = this;
        this.collection.offset += 15;
        this.collection.fetch().done(function(response){
            if ( response.length < 15 ) {
                $('#nextButton').hide(0);
                $('#prevButton').show(0);
            } else { $('#prevButton').show(0); }
        });
    },
    prevPage: function() {
         var self = this;
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

        var self = this;
 
        $('.menu-wrapper > .title').html( 'Контакты <span class="subtitle">база с которой мы работаем</span>' );

        $('#pageContent').html(this.el);
        this.collection = new Contacts();
        this.listenTo( this.collection, 'reset add change remove', this.render, this );
        this.collection.fetch();

        this.unbind();
        $('.menu-wrapper .search').show();
        $('#newContact').show(0);
        $('#actionButton').hide(0);
        $('#nextButton').show(0).click(function(){
            self.nextPage();
        });
        $('#prevButton').hide(0).click(function(){
            self.prevPage();
        });

        $('.menu-wrapper > .search').keyup(function() {
            if ($(this).val().length > 1)  {
                self.collection.search = $(this).val();
                self.collection.fetch();
            }
            if ($(this).val().length == 0) {
                self.collection.search = '';
                self.collection.fetch();
            }
        }).focus(function() { $(this).select() });
    },

    render: function() {
        var tpl = _.template( this.template );
        var that = this;
        this.$el.html( tpl() );
        _.each(this.collection.models, function(item) {
            that.renderContactList( item );
        }, this );

        var sortby = this.collection.sortby,
            asc = this.collection.asc,
            $elem = this.$el.find("td[data-sortby='" + sortby + "']")
        $elem.toggleClass('_active');
        if ( asc ) { $elem.toggleClass('_asc') };
    },

    renderContactList: function( item ) {
        var contactViewList = new ContactViewList({
            model: item
        });
        $('#contactsViewList').append( contactViewList.render().el )
    },
});


var Call = Backbone.Model.extend();
var Calls = Backbone.Collection.extend({
    model: Call,
    url: '/api/calls',
    offset: 0,
    sortby: 'created',
    asc: 0,

    fetch: function(options) {
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
    events: { 
        'click span#addToContacts': 'addToContacts',
        'click span[data-phone]': 'addphone',
        'click #play': 'playcall'
    },
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

    addphone: function(event) {
        var phone = $(event.target).data('phone');

        if ( $('body').hasClass('_hideCaller') ) { $('body').toggleClass('_hideCaller') }
        $('#callerWidget .phonenumber').val(phone).focus();
    },
    addToContacts: function(event) {
        var phone = $(event.target).siblings().data('phone');
        if ( $('.contact-create').is(":hidden") ) {
            $('.contact-create').slideToggle();
        }
        $('#actionsWrapper input[name=phone]').val(phone);
        $('#actionsWrapper input[name=name]').focus();
    }

});
var CallsViewList = Backbone.View.extend({
    tagName: 'table',
    className: 'calls-table',
    template: $('#tpl-calls-list').html(),
    events: { 'click thead td[data-sortby]': 'sortby' },

    nextPage: function() {
        var self = this;
        this.collection.offset += 15;
        this.collection.fetch().done(function(response){
            if ( response.length < 15 ) {
                $('#nextButton').hide(0);
                $('#prevButton').show(0);
            } else { $('#prevButton').show(0); }
        });
    },
    prevPage: function() {
         var self = this;
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

        $('#pageContent').html(this.el);
        var self = this;
        this.collection.fetch();

        this.unbind();
        $('.menu-wrapper .search').hide();
        $('#newContact').hide(0);
        $('#actionButton').hide(0);
        $('#nextButton').show(0).click(function(){
            self.nextPage();
        });
        $('#prevButton').hide(0).click(function(){
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

App.user.fetch({
    success: function() {
        App.user.isAuth = true;
    },
    error: function() {
        App.user.isAuth = false;
        App.router = new Router();
        Backbone.history.start();
        App.router.navigate('login', {trigger: true});
    }
}).done(function(response) {
    App.router = new Router();
    Backbone.history.start();
    
    if ( App.user.isAuth ) {
        App.router.navigate(location.hash, true);
        $('.user-login > .login').html(App.user.get('username') || App.user.get('login'));
    } else {
    App.router.navigate('login', {trigger: true});
    }
})


// })


// } (jQuery));