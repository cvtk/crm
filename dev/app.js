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

var Contact = Backbone.Model.extend();
var Contacts = Backbone.Collection.extend({ model: Contact });
var ContactViewList = Backbone.View.extend({
    tagName: 'tr',
    className: 'contact-line',
    template: $('#tpl-contact-list').html(),
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

} (jQuery));