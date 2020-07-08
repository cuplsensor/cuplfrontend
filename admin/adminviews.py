from flask import Blueprint, render_template, redirect, flash, url_for, current_app
from .forms.tags import AddTagForm
from wsapiwrapper.admin.tag import TagWrapper
from wsapiwrapper.admin.capture import CaptureWrapper
from wsapiwrapper.admin.user import UserWrapper
from wsapiwrapper.admin.tagview import TagViewWrapper
from .config import WSB_ORIGIN, ADMINAPI_CLIENTID, ADMINAPI_CLIENTSECRET


# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('dashboard', __name__, template_folder='templates', static_folder='static', static_url_path='/admin/static')


@bp.route('/')
def home_page():
    return redirect(url_for('dashboard.tag_list_page'))


@bp.route('/tags', methods=['GET', 'POST'])
def tag_list_page(**kwargs):
    form = AddTagForm()
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
        flash("Tag added")
        return redirect(url_for('dashboard.home_page'))

    taglist = tagwrapper.get_many()

    return render_template('pages/tag/tag_list_page.html', form=form, taglist=taglist, **kwargs)


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

@bp.route('/tag/<int:tagid>')
def tag_page(tagid):
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    tag = tagwrapper.get(tagid)
    return render_template('pages/tag/tag_page.html', tag=tag)


@bp.route('/tag/<int:tagid>/captures')
def tag_captures_page(tagid):
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    tag = tagwrapper.get(tagid)

    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN,
                                    adminapi_client_id=ADMINAPI_CLIENTID,
                                    adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    capturelist = capturewrapper.get_many(tag_id=tagid)

    return render_template('pages/tag/tag_captures_page.html', tag=tag, capturelist=capturelist)


@bp.route('/tag/<int:tagid>/tagviews')
def tag_tagviews_page(tagid):
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    tag = tagwrapper.get(tagid)

    tagViewWrapper = TagViewWrapper(baseurl=WSB_ORIGIN,
                                    adminapi_client_id=ADMINAPI_CLIENTID,
                                    adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    tagviewlist = tagViewWrapper.get_many(tagid)
    return render_template('pages/tag/tag_tagviews_page.html', tag=tag, tagviewlist=tagviewlist)

@bp.route('/tag/<int:tagid>/configure')
def configure_page(tagid):
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    tag = tagwrapper.get(tagid)
    return render_template('pages/tag/configure_page.html', tag=tag)


@bp.route('/tag/<int:tagid>/simulate')
def sim_page(tagid):
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    tag = tagwrapper.get(tagid)
    simstr = tagwrapper.simulate(tagid=int(tagid), frontendurl=current_app.config["WSF_ORIGIN"])
    return render_template('pages/tag/sim_page.html', tag=tag, simstr=simstr)

@bp.route('/signin')
def signin():
    response = render_template('pages/signin_page.html', **kwargs)
    return response
