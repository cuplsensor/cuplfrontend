# -*- coding: utf-8 -*-
"""
    wsfrontend.consumer
    ~~~~~~~~~~~~~~~~~~
"""

from flask import Flask
from .defs import auth0_template
from .views import bp as viewsbp
from .boxviews import bp as boxviewsbp
from .captureviews import bp as captureviewsbp
from .calviews import bp as calviewsbp


def create_app(package_name, settings_override=None):
    """Returns the consumer application instance"""
    app = Flask(package_name, instance_relative_config=True)

    app.config.from_object('wsfrontend.config')
    app.config.from_object(settings_override)

    app.register_blueprint(viewsbp)
    app.register_blueprint(boxviewsbp)
    app.register_blueprint(calviewsbp)
    app.register_blueprint(captureviewsbp)

    app.errorhandler(404)(handle_error)
    app.errorhandler(401)(handle_error)

    return app


def handle_error(e):
    return auth0_template('errors/%s.html' % e.code, code=e.code, desc=str(e)), e.code
