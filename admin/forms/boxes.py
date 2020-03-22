# -*- coding: utf-8 -*-
"""
    web.boxes.forms

    Boxes forms
"""

from flask_wtf import Form
from wtforms import IntegerField, SubmitField
from wtforms.validators import Optional, ValidationError, Length

__all__ = ['AddBoxForm']


class AddBoxForm(Form):
    box_id = IntegerField('box_id', validators=[Optional()])
    submit = SubmitField('Add')
