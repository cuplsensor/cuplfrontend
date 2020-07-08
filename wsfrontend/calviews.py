from flask import Blueprint, redirect, render_template, \
request, url_for, session, abort, flash, Response, jsonify, current_app
from .forms.locations import AddLocationForm, EditLocationForm
from werkzeug.exceptions import NotFound

# For GET and POST
import requests
import json
import os
import datetime, time
from datetime import timezone
from .defs import auth0_template, requires_auth, optional_auth, route
from calendar import monthrange
from wsapiwrapper.consumer.tag import TagWrapper
from wsapiwrapper.consumer.sample import SampleWrapper

# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('calview', __name__, template_folder='templates/pages/cal', static_folder='static', static_url_path='/static/frontend', url_prefix='/tag/<string:serial>/cal')

@bp.errorhandler(NotFound)
def handle_error(e):
    return render_template('errors/%s.html' % e.code), e.code

@route(bp, '/')
@optional_auth
def index(serial, range='day', sensor='temp', **kwargs):
    #tagwithserial = tags.get_by_serial(serial)
    if tagwithserial == None:
        abort(404)
    else:
        newlocform = AddLocationForm(serial=tagwithserial.serial, prefix="newloc")
        editlocform = EditLocationForm(serial=tagwithserial.serial, prefix="editloc")
        return auth0_template('dayindex_page.html' \
                                            , tag=tagwithserial \
                                            , range='day' \
                                            , year=None \
                                            , month=None \
                                            , day=None \
                                            , tzoffsetmins=json.dumps(None) \
                                            , sensor='temp' \
                                            , newlocform=newlocform \
                                            , editlocform=editlocform \
                                            , **kwargs)

@route(bp, '/<range>/<sensor>')
@optional_auth
def sensor(serial, range, sensor, **kwargs):
    #tagwithserial = tags.get_by_serial(serial)
    if tagwithserial == None:
        abort(404)
    else:
        newlocform = AddLocationForm(serial=tagwithserial.serial, prefix="newloc")
        editlocform = EditLocationForm(serial=tagwithserial.serial, prefix="editloc")
        return auth0_template('dayindex_page.html' \
                                            , tag=tagwithserial \
                                            , range=range \
                                            , year=None \
                                            , month=None \
                                            , day=None \
                                            , tzoffsetmins=json.dumps(None) \
                                            , sensor=sensor \
                                            , newlocform=newlocform \
                                            , editlocform=editlocform \
                                            , **kwargs)

@route(bp, '/<range>/<sensor>/<year>/<month>/<day>', methods=['GET', 'POST'])
@optional_auth
def cal(serial, year, month, day, range, sensor, **kwargs):
    current_app.logger.info('test')

    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN)
    tag = tagwrapper.get(tagserial=serial)

    tagwithserial = tag
    if tagwithserial == None:
        current_app.logger.info('test')
        abort(404)
    if request.method == 'POST':
        data = request.values
        year = int(data['year'])
        month = int(data['month'])
        day = int(data['day'])
        tzoffsetmins = int(data['tzoffsetmins'])
        range = data['range']
        starttime = datetime.datetime(year=year, month=month, day=day, tzinfo=timezone(datetime.timedelta(minutes=tzoffsetmins)))
        if (range == 'day'):
            rangelengthdays = 1
        elif (range == 'week'):
            starttime = starttime - datetime.timedelta(days=starttime.weekday())
            rangelengthdays = 7
        elif (range == 'month'):
            starttime = starttime.replace(day=1)
            _ , rangelengthdays = monthrange(starttime.year, starttime.month)
        else:
            rangelengthdays = 0

        starttime = starttime.astimezone(timezone.utc)
        endtime = starttime + datetime.timedelta(days=rangelengthdays)

        samplewrapper = SampleWrapper(baseurl=WSB_ORIGIN)
        samples = samplewrapper.get_samples(serial=serial, starttime=str(starttime), endtime=str(endtime))
        if len(samples) is not 0:
            mrlocation = samples[0]['location']
        else:
            mrlocation = None
        #capturesamples, mrlocation = tagwithserial.uniquesampleswindow(starttime, endtime)
        startstamp = starttime.timestamp()
        endstamp = endtime.timestamp()
        return jsonify(samples=samples, mrloc=mrlocation, startstamp=startstamp, endstamp=endstamp)
    else:
        newlocform = AddLocationForm(serial=tagwithserial['serial'], prefix="newloc")
        editlocform = EditLocationForm(serial=tagwithserial['serial'], prefix="editloc")
        return auth0_template('dayindex_page.html' \
                                                , tag=tagwithserial \
                                                , range=range \
                                                , year=year \
                                                , month=month \
                                                , day=day \
                                                , sensor=sensor \
                                                , newlocform=newlocform \
                                                , editlocform=editlocform \
                                                , **kwargs)
