/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    email: {
        type: 'email',
        required: true,
        unique: true
    },
    password: {
        type: 'string',
        required: true,
        minLength: 6,
        protected: true
    },
    firstName: {
        type: 'string',
        required: true
    },
    lastName: {
        type: 'string',
        required: true
    },
    birthDate: {
        type: 'date',
        required: true
    },
    subscriptions: {
        collection: 'subscription',
        via: 'show'
    }
  },
  beforeCreate: function (attrs, next) {
    var bcrypt = require('bcrypt');

    bcrypt.hash(attrs.password, 10, function(err, hash) {
        if (err) return next(err);

        attrs.password = hash;
        next();
    });
  }
};

