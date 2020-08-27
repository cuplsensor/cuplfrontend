from flask import Blueprint, redirect, render_template, url_for, session, current_app
from werkzeug.exceptions import NotFound
from wsapiwrapper.consumer.capture import CaptureWrapper
from wsapiwrapper.consumer.tag import TagWrapper
from wsapiwrapper.consumer.tagview import TagViewWrapper

# For GET and POST
from wsfrontend.views.defs import auth0_template, optional_auth, route

# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('tagview', __name__, template_folder='../../templates/pages/consumer/tag', static_folder='static',
               static_url_path='/static/frontend', url_prefix='/tag')


@bp.errorhandler(NotFound)
def handle_error(e):
    return render_template('errors/%s.html' % e.code), e.code


@route(bp, '/<string:serial>')
@optional_auth
def tag(serial, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN)
    tag = tagwrapper.get(tagserial=serial)

    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN)
    latestcapture = capturewrapper.get_list(serial, offset=0, limit=1)[0]
    latestsample = capturewrapper.get_samples(capture_id=latestcapture['id'],
                                              offset=0,
                                              limit=1)[0]

    # Post a TagView
    if 'access_token' in session.keys():
        tvwrapper = TagViewWrapper(baseurl=WSB_ORIGIN, tokenstr=session['access_token'])
        tvwrapper.post(tagserial=serial)

    return auth0_template('tag_page.html'
                          , tag=tag
                          , latestcapture=latestcapture
                          , latestsample=latestsample
                          , **kwargs)


@route(bp, '/<string:serial>/battery')
@optional_auth
def battery(serial, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]

    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN)
    tag = tagwrapper.get(tagserial=serial)

    batterymvlist = list()
    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN)
    captures = capturewrapper.get_list(serial, offset=0, limit=100)
    for capture in captures:
        batterymvlist.append({'t': capture['timestamp'], 'y':capture['batvoltagemv']})

    return auth0_template('battery_page.html'
                          , tag=tag
                          , temps=batterymvlist, miny=1500, maxy=4000, sensor='battery', **kwargs)

@route(bp, '/<string:serial>/confignfc')
@optional_auth
def confignfc(serial, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]

    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN)
    tag = tagwrapper.get(tagserial=serial)

    return auth0_template('confignfc_page.html', tag=tag, **kwargs)

@route(bp, '/<string:serial>/capture/<int:captid>')
@optional_auth
def capture(captid, **kwargs):
    return redirect(url_for('captureview.temp', captid=captid))


def plot_sensor(captid, sensor, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN)
    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN)

    capt = capturewrapper.get(captid)
    samples = capturewrapper.get_samples(captid)

    tag = tagwrapper.get(tagserial=capt['tagserial'])

    plotdata = []

    for sample in samples:
        smpl = {'t': sample['timestamp'], 'y': sample[sensor]}
        plotdata.append(smpl)

    maxy = max(plotdata, key=lambda smpl: smpl.get('y')).get('y')
    miny = min(plotdata, key=lambda smpl: smpl.get('y')).get('y')

    return auth0_template('plot_page.html'
                          , tag=tag
                          , capture=capt
                          , temps=plotdata, miny=miny, maxy=maxy, sensor=sensor, **kwargs)

@route(bp, '/<string:serial>/capture/<int:captid>/temp')
@optional_auth
def temp(captid, **kwargs):
    return plot_sensor(captid, 'temp', **kwargs)


@route(bp, '/<string:serial>/capture/<int:captid>/rh')
@optional_auth
def rh(captid, **kwargs):
    return plot_sensor(captid, 'rh', **kwargs)


@route(bp, '/<string:serial>/capture/<int:captid>/status')
@optional_auth
def status(serial, captid, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN)
    tag = tagwrapper.get(tagserial=serial)

    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN)
    capt = capturewrapper.get(captid)

    return auth0_template('status_page.html' \
                          , tag=tag
                          , capture=capt
                          , **kwargs)
