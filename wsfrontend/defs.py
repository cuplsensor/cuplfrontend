from functools import wraps
from flask import render_template, session, redirect, url_for, request, current_app
import jwt


def route(bp, *args, **kwargs):
    def decorator(f):
        @bp.route(*args, **kwargs)
        @wraps(f)
        def wrapper(*args, **kwargs):
            return f(*args, **kwargs)
        return f

    return decorator


def auth0_template(templ_name, **kwargs):
    kwargs['auth0clientid'] = current_app.config['AUTH0_CLIENTID']
    kwargs['auth0url'] = current_app.config['IDP_ORIGIN']
    return render_template(templ_name, **kwargs)


# Optional auth decorator
def optional_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    user = session.get('user')
    # TODO: Verify user token here to make sure it has not expired.
    #  If it has, pop the access token and user info from the session.
    return f(userobj=user, *args, **kwargs)
  return decorated


# Requires auth decorator
def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    user = session.get('user')
    if user == None:
        return redirect(url_for('dashboard.signin', next=request.url))
    return f(userobj=user, *args, **kwargs)
  return decorated


# Requires admin auth decorator
def requires_admin(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    adminapi_token = session.get('ADMINAPI_TOKEN')
    if (adminapi_token == None) and (current_app.config['ADMIN_SECURE']):
        return redirect(url_for('adminbp.signin', next=request.url))

    return f(adminapi_token=adminapi_token, *args, **kwargs)
  return decorated