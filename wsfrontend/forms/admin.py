# -*- coding: utf-8 -*-
"""
    web.tags.forms

    Tags forms
"""

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

__all__ = ['AdminTokenForm']


class AdminTokenForm(FlaskForm):
    client_id = StringField('client_id', validators=[DataRequired()])
    client_secret = StringField('client_secret', validators=[DataRequired()])
    submit = SubmitField('Add')
