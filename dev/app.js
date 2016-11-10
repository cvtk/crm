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

var Contact = Backbone.Model.extend();
var Contacts = Backbone.Collection.extend({ model: Contact });
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
    el: '#contactsViewList',
    initialize: function() {
        this.collection = new Contacts(contacts);
        this.render();
    },
    render: function() {
        var that = this;
        _.each(this.collection.models, function(item) {
            that.renderContactList( item );
        }, this );
    },
    renderContactList: function( item ) {
        var contactViewList = new ContactViewList({
            model: item
        });
        this.$el.append( contactViewList.render().el )
    }
});
var contactsViewList = new ContactsViewList();

var Call = Backbone.Model.extend();
var Calls = Backbone.Collection.extend({ model: Call });
var CallViewList = Backbone.View.extend({
    tagName: 'tr',
    className: 'call-line',
    template: $('#tpl-call-line').html(),
    render: function() {
        var tpl = _.template( this.template );
        this.$el.html( tpl( this.model.toJSON() ) );
        return this;
    }
});
var CallsViewList = Backbone.View.extend({
    el: '#callsViewList',
    initialize: function() {
        this.collection = new Calls(calls);
        this.render();
    },
    render: function() {
        var that = this;
        _.each(this.collection.models, function( item ) {
            that.renderCallList( item );
        }, this );
    },
    renderCallList: function( item ) {
        var callViewList = new CallViewList({
            model: item
        });
        this.$el.append( callViewList.render().el )
    }
});
var callsViewList = new CallsViewList();

} (jQuery));