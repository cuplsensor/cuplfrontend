# -*- coding: utf-8 -*-
"""
    wsgi
    ~~~~
    overholt wsgi module
"""
from werkzeug.debug import DebuggedApplication
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple
from os import environ as env
import wsfrontend
import admin


def simple(env, resp):
    resp('200 OK', [('Content-Type', 'text/plain')])
    return [b'Hello WSGI World']


app = DispatcherMiddleware(wsfrontend.create_app(__name__), {
                           '/admin': admin.create_app('adminapp')
})

app = DebuggedApplication(app, evalex=False)
app.debug = True

if __name__ == "__main__":
    port = int(env.get('WSF_PORT'))
    run_simple('localhost', port, app)
