from flask import Blueprint, render_template, redirect, flash, url_for, request, send_file
from .forms.boxes import AddBoxForm
from wsapiwrapper.admin.tag import TagWrapper
from wsapiwrapper.admin.capture import CaptureWrapper
from wsapiwrapper.admin.user import UserWrapper
from wsapiwrapper.admin.tagview import TagViewWrapper
from .config import WSB_ORIGIN, ADMINAPI_CLIENTID, ADMINAPI_CLIENTSECRET


# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('dashboard', __name__, template_folder='templates', static_folder='static', static_url_path='/admin/static')


@bp.route('/')
def home_page():
    return redirect(url_for('dashboard.box_list_page'))


@bp.route('/boxes', methods=['GET', 'POST'])
def box_list_page(**kwargs):
    form = AddBoxForm()
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    if form.validate_on_submit():
        serial = form.serial.data
        secretkey = form.secretkey.data
        fwversion = form.fwversion.data
        hwversion = form.hwversion.data
        description = form.description.data
        tagwrapper.post(serial=serial, secretkey=secretkey, fwversion=fwversion, hwversion=hwversion, description=description)
        flash("Box added")
        return redirect(url_for('dashboard.home_page'))

    boxlist = tagwrapper.get_many()

    return render_template('pages/box/box_list_page.html', form=form, boxlist=boxlist, **kwargs)


@bp.route('/captures')
def capture_list_page():
    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN,
                                    adminapi_client_id=ADMINAPI_CLIENTID,
                                    adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    capturelist = capturewrapper.get_many()
    return render_template('pages/capture/capture_list_page.html', capturelist=capturelist)


@bp.route('/users')
def user_list_page():
    userwrapper = UserWrapper(baseurl=WSB_ORIGIN,
                              adminapi_client_id=ADMINAPI_CLIENTID,
                              adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    userlist = userwrapper.get_many()
    return render_template('pages/user/user_list_page.html', userlist=userlist)


@bp.route('/user/<int:userid>')
def user_page(userid):
    userwrapper = UserWrapper(baseurl=WSB_ORIGIN,
                              adminapi_client_id=ADMINAPI_CLIENTID,
                              adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    user = userwrapper.get(userid)
    return render_template('pages/user/user_page.html', user=user)


@bp.route('/capture/<int:captid>')
def capture_page(captid):
    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN,
                              adminapi_client_id=ADMINAPI_CLIENTID,
                              adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    capture = capturewrapper.get(captid)
    return render_template('pages/capture/capture_page.html', capture=capture)

@bp.route('/box/<int:boxid>')
def box_page(boxid):
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    box = tagwrapper.get(boxid)
    return render_template('pages/box/box_page.html', box=box)


@bp.route('/box/<int:boxid>/captures')
def box_captures_page(boxid):
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    box = tagwrapper.get(boxid)

    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN,
                                    adminapi_client_id=ADMINAPI_CLIENTID,
                                    adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    capturelist = capturewrapper.get_many(box_id=boxid)

    return render_template('pages/box/box_captures_page.html', box=box, capturelist=capturelist)


@bp.route('/box/<int:boxid>/tagviews')
def box_tagviews_page(boxid):
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    tag = tagwrapper.get(boxid)

    tagViewWrapper = TagViewWrapper(baseurl=WSB_ORIGIN,
                                    adminapi_client_id=ADMINAPI_CLIENTID,
                                    adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    tagviewlist = tagViewWrapper.get_many(boxid)
    return render_template('pages/box/box_tagviews_page.html', box=tag, tagviewlist=tagviewlist)

@bp.route('/box/<int:boxid>/configure')
def configure_page(boxid):
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    box = tagwrapper.get(boxid)
    return render_template('pages/box/configure_page.html', box=box)


@bp.route('/box/<int:boxid>/simulate')
def sim_page(boxid):
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    box = tagwrapper.get(boxid)
    simstr = tagwrapper.simulate(tagid=int(boxid), frontendurl="http://localhost:8080")
    return render_template('pages/box/sim_page.html', box=box, simstr=simstr)

@bp.route('/signin')
def signin():
    response = render_template('pages/signin_page.html', **kwargs)
    return response
