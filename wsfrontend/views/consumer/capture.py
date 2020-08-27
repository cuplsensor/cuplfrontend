from flask import Blueprint, redirect, render_template, url_for, current_app
from werkzeug.exceptions import NotFound
from wsapiwrapper.consumer.capture import CaptureWrapper
# For GET and POST
from wsfrontend.views.defs import optional_auth, route

# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('captureview', __name__, template_folder='../../templates/pages/consumer/capture', static_folder='static',
               static_url_path='/static/frontend', url_prefix='/capture')


@bp.errorhandler(NotFound)
def handle_error(e):
    return render_template('errors/%s.html' % e.code), e.code


@route(bp, '/<int:captid>')
@optional_auth
def capture(captid, **kwargs):
    return redirect(url_for('captureview.temp', captid=captid))


@route(bp, '/<int:captid>/temp')
@optional_auth
def temp(captid, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN)
    capt = capturewrapper.get(captid)
    return redirect(url_for('tagview.temp', serial=capt['tagserial'], captid=captid))


@route(bp, '/<int:captid>/rh')
@optional_auth
def rh(captid, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN)
    capt = capturewrapper.get(captid)
    return redirect(url_for('tagview.rh', serial=capt['tagserial'], captid=captid))


@route(bp, '/<int:captid>/status')
@optional_auth
def status(captid, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN)
    capt = capturewrapper.get(captid)
    return redirect(url_for('tagview.status', serial=capt['tagserial'], captid=captid))
