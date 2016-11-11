(function ($) {
    var contacts = [
        { name: 'Цветков Олег Владиславович', phone: '+79605330101', family: 'Цветкова Ольга Борисовна', comment: 'Добропорядочный гражданин' },
        { name: 'Цветков Олег Владиславович', phone: '+79605330101', family: 'Цветкова Ольга Борисовна', comment: 'Добропорядочный гражданин' },
        { name: 'Цветков Олег Владиславович', phone: '+79605330101', family: 'Цветкова Ольга Борисовна', comment: 'Добропорядочный гражданин' },
        { name: 'Цветков Олег Владиславович', phone: '+79605330101', family: 'Цветкова Ольга Борисовна', comment: 'Добропорядочный гражданин' },
        { name: 'Цветков Олег Владиславович', phone: '+79605330101', family: 'Цветкова Ольга Борисовна', comment: 'Добропорядочный гражданин' },
        { name: 'Цветков Олег Владиславович', phone: '+79605330101', family: 'Цветкова Ольга Борисовна', comment: 'Добропорядочный гражданин' },
        { name: 'Цветков Олег Владиславович', phone: '+79605330101', family: 'Цветкова Ольга Борисовна', comment: 'Добропорядочный гражданин' },
        { name: 'Цветков Олег Владиславович', phone: '+79605330101', family: 'Цветкова Ольга Борисовна', comment: 'Добропорядочный гражданин' },
        { name: 'Цветков Олег Владиславович', phone: '+79605330101', family: 'Цветкова Ольга Борисовна', comment: 'Добропорядочный гражданин' },
        { name: 'Цветков Олег Владиславович', phone: '+79605330101', family: 'Цветкова Ольга Борисовна', comment: 'Добропорядочный гражданин' }
    ];
    var calls = [
        { id: 1, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' },
        { id: 2, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' },
        { id: 3, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' },
        { id: 4, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' },
        { id: 5, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' },
        { id: 6, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' },
        { id: 7, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' },
        { id: 8, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' },
        { id: 9, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' },
        { id: 10, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' },
        { id: 11, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' },
        { id: 12, datetime: '10.11.2016', src: 'Цветков Олег Владиславович', dst: '+79605330101', result: 'Ответ', audio: '/root/auto.mp3' }
    ];


var App = {};
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
        this.collection.fetch({ update: true })
        this.listenTo( this.collection, 'reset add change remove', this.render, this );
        this.render();
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
        this.collection.fetch();
        var self = this;
        this.timer = setInterval(function() {
              self.collection.fetch();
         }, 10000);
        this.listenTo( this.collection, 'reset add change remove', this.render, this );
        this.render();
        
    },
    close: function() {
        clearInterval(this.timer);
    },
    render: function() {
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
        '' : 'index',
        'calls' : 'calls'
    },

    index: function() {
        this.loadView( new ContactsViewList() );
    },

    calls: function() {
        this.loadView( new CallsViewList() );
    },

    loadView : function( view ) {
        this.view && this.view.remove();
        this.view = view;
    }
});

Backbone.history.start();
App.router = new Router();
} (jQuery));