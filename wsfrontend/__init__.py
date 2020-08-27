# -*- coding: utf-8 -*-
"""
    wsfrontend.consumer
    ~~~~~~~~~~~~~~~~~~
"""

from flask import Flask
from flask_qrcode import QRcode
from wsfrontend.views.defs import auth0_template
from wsfrontend.views.consumer.views import bp as consumerviewsbp
from wsfrontend.views.consumer.tag import bp as consumertagbp
from wsfrontend.views.consumer.capture import bp as consumercapturebp
from wsfrontend.views.consumer.cal import bp as consumercalbp
from wsfrontend.views.admin.adminviews import bp as adminviewsbp

def create_app(package_name, settings_override=None):
    """Returns the consumer application instance"""
    app = Flask(package_name, instance_relative_config=True)

    app.config.from_object('config')
    app.config.from_object(settings_override)

    app.register_blueprint(consumerviewsbp)
    app.register_blueprint(consumertagbp)
    app.register_blueprint(consumercalbp)
    app.register_blueprint(consumercapturebp)
    app.register_blueprint(adminviewsbp, url_prefix='/admin')

    app.errorhandler(404)(handle_error)
    app.errorhandler(401)(handle_error)

    QRcode(app)

    return app


def handle_error(e):
    return auth0_template('errors/%s.html' % e.code, code=e.code, desc=str(e)), e.code
