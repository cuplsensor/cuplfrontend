from flask import Blueprint, render_template, \
request, jsonify, current_app
from werkzeug.exceptions import NotFound

# For GET and POST
import json
import datetime
from datetime import timezone
from wsfrontend.views.defs import auth0_template, optional_auth, route
from calendar import monthrange
from wsapiwrapper.consumer.tag import TagWrapper
from wsapiwrapper.consumer.sample import SampleWrapper

# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('calview', __name__, template_folder='../../templates/pages/consumer/cal', static_folder='static', static_url_path='/static/frontend', url_prefix='/tag/<string:serial>/cal')


@bp.errorhandler(NotFound)
def handle_error(e):
    return render_template('errors/%s.html' % e.code), e.code


@route(bp, '/caljson', methods=['POST'])
def caljson(serial):
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

    samplewrapper = SampleWrapper(baseurl=current_app.config["WSB_ORIGIN"])
    samples = samplewrapper.get_samples(serial=serial, starttime=str(starttime), endtime=str(endtime))
    startstamp = starttime.timestamp()
    endstamp = endtime.timestamp()
    return jsonify(samples=samples, startstamp=startstamp, endstamp=endstamp)


@route(bp, '/')
@optional_auth
def index(serial, range='day', sensor='temp', **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN)
    tag = tagwrapper.get(tagserial=serial)

    return auth0_template('dayindex_page.html'
                                        , tag=tag
                                        , range='day'
                                        , year=None
                                        , month=None
                                        , day=None
                                        , tzoffsetmins=json.dumps(None)
                                        , sensor='temp'
                                        , **kwargs)


@route(bp, '/<range>/<sensor>')
@optional_auth
def sensor(serial, range, sensor, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN)
    tag = tagwrapper.get(tagserial=serial)

    return auth0_template('dayindex_page.html'
                                        , tag=tag
                                        , range=range
                                        , year=None
                                        , month=None
                                        , day=None
                                        , tzoffsetmins=json.dumps(None)
                                        , sensor=sensor
                                        , **kwargs)


@route(bp, '/<range>/<sensor>/<year>/<month>/<day>', methods=['GET', 'POST'])
@optional_auth
def cal(serial, year, month, day, range, sensor, **kwargs):
    current_app.logger.info('test')

    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN)
    tag = tagwrapper.get(tagserial=serial)

    return auth0_template('dayindex_page.html'
                                            , tag=tag
                                            , range=range
                                            , year=year
                                            , month=month
                                            , day=day
                                            , sensor=sensor
                                            , **kwargs)
