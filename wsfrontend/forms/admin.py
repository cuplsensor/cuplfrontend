# -*- coding: utf-8 -*-
"""
    web.tags.forms

    Tags forms
"""

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField, RadioField, BooleanField
from wtforms.validators import DataRequired

__all__ = ['AdminTokenForm', 'SimulateForm']


class AdminTokenForm(FlaskForm):
    client_id = StringField('client_id', validators=[DataRequired()])
    client_secret = StringField('client_secret', validators=[DataRequired()])
    submit = SubmitField('Add')


class SimulateForm(FlaskForm):
    frontendurl = StringField('frontendurl', validators=[DataRequired()])
    nsamples = IntegerField('nsamples', validators=[DataRequired()], default=100)
    smplintervalmins = IntegerField('smplintervalmins', default=10)
    tagformat = RadioField('tagformat', default=1, choices=[(1, 'Temperature & Relative Humidity'), (2, 'Temperature Only')])
    usehmac = BooleanField('usehmac', default=True)
    minbatv = IntegerField('minbatv', default=2200)
    bor = BooleanField('bor', default=False)
    svsh = BooleanField('svsh', default=False)
    wdt = BooleanField('wdt', default=False)
    misc = BooleanField('misc', default=False)
    lpm5wu = BooleanField('lpm5wu', default=False)
    clockfail = BooleanField('clockfail', default=False)
    tagerror = BooleanField('tagerror', default=False)
    submit = SubmitField('Update')
