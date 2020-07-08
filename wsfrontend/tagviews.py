from flask import Blueprint, redirect, render_template, \
    request, url_for, session, abort, flash, Response, jsonify, current_app
# from ..services import tags, viewlogitems
from werkzeug.exceptions import NotFound
from wsapiwrapper.consumer.capture import CaptureWrapper
from wsapiwrapper.consumer.tag import TagWrapper
from wsapiwrapper.consumer.tagview import TagViewWrapper

# For GET and POST
import requests
import json
import os
from .defs import auth0_template, requires_auth, optional_auth, route

# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('tagview', __name__, template_folder='templates/pages/tag', static_folder='static',
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
