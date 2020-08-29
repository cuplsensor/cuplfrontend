from flask import Blueprint, redirect, render_template, \
request, url_for, current_app
from wsapiwrapper.consumer.capture import CaptureWrapper
from wsapiwrapper.consumer.version import Version

# For GET and POST
from wsfrontend.views.defs import auth0_template, optional_auth, route


# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('dashboard', __name__, template_folder='../../templates', static_folder='../../static', static_url_path='/wsfrontend/static')


@bp.route('/')
@optional_auth
def home_page(**kwargs):
    """ Home page is accessible to all."""
    serial = request.args.get('s')
    statusb64 = request.args.get('x')
    timeintb64 = request.args.get('t')
    circbufb64 = request.args.get('q')
    versionStr = request.args.get('v')

    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]

    if serial is not None:
        capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN)
        capt = capturewrapper.post(circbufb64, serial, statusb64, timeintb64, versionStr)
        response = redirect(url_for('captureview.capture', captid=capt['id']))
    else:
        response = auth0_template('pages/home_page.html', **kwargs)

    return response


@route(bp, '/version')
def version():
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    version = Version(baseurl=WSB_ORIGIN).get()
    return render_template('pages/version_page.html', backendversion=version['cuplbackend'], codecversion=version['cuplcodec'])
