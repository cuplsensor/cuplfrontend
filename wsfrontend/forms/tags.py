# -*- coding: utf-8 -*-
"""
    web.tags.forms

    Tags forms
"""

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import Optional, ValidationError, Length

__all__ = ['AddTagForm']


class AddTagForm(FlaskForm):
    serial = StringField('tag_serial', validators=[Optional(), Length(min=8, max=8)])
    secretkey = StringField('tag_secretkey', validators=[Optional(), Length(min=16, max=16)])
    fwversion = StringField('tag_fwversion', validators=[Optional()])
    hwversion = StringField('tag_hwversion', validators=[Optional()])
    description = StringField('tag_description', validators=[Optional(), Length(max=280)])
    submit = SubmitField('Add')
