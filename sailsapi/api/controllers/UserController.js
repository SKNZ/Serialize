/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	login: function (req, res) {
        var bcrypt = require('bcrypt');

        User.findOneByEmail(req.body.email).exec(function (err, user) {
            if (err)
                res.badRequest({ error: 'Internal server error' });

            if (user) {
                bcrypt.compare(req.body.password, user.password, function (err, match) {
                    if (err)
                        res.badRequest({ error: 'Internal server error' });

                    if (match) {
                        req.session.authenticated = true;
                        req.session.user = user;
                        res.json(user);
                    } else {
                        if (req.session.authenticated)
                            req.session.authenticated = false;

                        res.badRequest({ error: 'Invalid credentials' });
                    }
                });
            } else {
                res.badRequest({ error: 'Invalid credentials' });
            }
        });
    }
};


