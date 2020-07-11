# -*- coding: utf-8 -*-
"""
    wsfrontend.consumer
    ~~~~~~~~~~~~~~~~~~
"""

from flask import Flask
from flask_qrcode import QRcode
from .defs import auth0_template
from .views import bp as viewsbp
from .tagviews import bp as tagviewsbp
from .captureviews import bp as captureviewsbp
from .calviews import bp as calviewsbp
from .adminviews import bp as adminviewsbp


def create_app(package_name, settings_override=None):
    """Returns the consumer application instance"""
    app = Flask(package_name, instance_relative_config=True)

    app.config.from_object('config')
    app.config.from_object(settings_override)

    app.register_blueprint(viewsbp)
    app.register_blueprint(tagviewsbp)
    app.register_blueprint(calviewsbp)
    app.register_blueprint(captureviewsbp)
    app.register_blueprint(adminviewsbp, url_prefix='/admin')

    app.errorhandler(404)(handle_error)
    app.errorhandler(401)(handle_error)

    QRcode(app)

    return app


def handle_error(e):
    return auth0_template('errors/%s.html' % e.code, code=e.code, desc=str(e)), e.code
