# -*- coding: utf-8 -*-
"""
    wsfrontend.admin
    ~~~~~~~~~~~~~~~~~~
"""

from flask import Flask, render_template
from flask_qrcode import QRcode
from .adminviews import bp as adminviewsbp


def create_app(package_name, settings_override=None):
    """Returns the admin application instance"""
    app = Flask(package_name, instance_relative_config=True)

    app.config.from_object('admin.config')
    app.config.from_object(settings_override)

    app.register_blueprint(adminviewsbp)

    app.errorhandler(404)(handle_error)
    app.errorhandler(401)(handle_error)

    QRcode(app)

    return app


def handle_error(e):
    return render_template('errors/%s.html' % e.code, code=e.code, desc=str(e))
