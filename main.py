# -*- coding: utf-8 -*-
"""
    wsgi
    ~~~~
    overholt wsgi module
"""
from werkzeug.debug import DebuggedApplication
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple
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
    run_simple('localhost', 8080, app)
