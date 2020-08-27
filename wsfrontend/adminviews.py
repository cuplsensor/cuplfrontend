from flask import Blueprint, render_template, redirect, flash, url_for, current_app, session, request, abort
from .defs import requires_admin
from requests.exceptions import HTTPError
from wsfrontend.forms.admin import AdminTokenForm, SimulateForm
from wsfrontend.forms.tags import AddTagForm
from wsapiwrapper.admin import request_admin_token
from wsapiwrapper.admin.tag import TagWrapper, TagFormat
from wsapiwrapper.admin.capture import CaptureWrapper
from wsapiwrapper.admin.user import UserWrapper
from wsapiwrapper.admin.tagview import TagViewWrapper

# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('adminbp', __name__, template_folder='templates', static_folder='static', static_url_path='/admin/static')


@bp.errorhandler(HTTPError)
def handle_api_error(e):
    if e.response.status_code == 401:
        flash(str(e), category="error")
        response = redirect(url_for('adminbp.signin', next=request.url))
    else:
        response = render_template('errors/admin/generic.html', code=e.response.status_code, desc=str(e))

    return response, e.response.status_code

@bp.route('/')
def home_page():
    return redirect(url_for('adminbp.tag_list_page'))

@bp.route('/tags/add', methods=['GET', 'POST'])
@requires_admin
def add_tag(adminapi_token):
    form = AddTagForm()
    tagwrapper = TagWrapper(baseurl=current_app.config['WSB_ORIGIN'], adminapi_token=adminapi_token)
    if form.validate_on_submit():
        serial = form.serial.data
        secretkey = form.secretkey.data
        fwversion = form.fwversion.data
        hwversion = form.hwversion.data
        description = form.description.data
        tagwrapper.post(serial=serial, secretkey=secretkey, fwversion=fwversion, hwversion=hwversion, description=description)
        flash("Tag added", category="info")
        return redirect(url_for('adminbp.home_page'))

    return render_template('pages/admin/tag/add_tag_page.html', form=form)


@bp.route('/tag/<int:tagid>/delete')
@requires_admin
def delete_tag(adminapi_token, tagid):
    tagwrapper = TagWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                            adminapi_token=adminapi_token)
    tagwrapper.delete(tagid)
    return redirect(url_for("adminbp.tag_list_page"))


@bp.route('/tags')
@requires_admin
def tag_list_page(adminapi_token="", **kwargs):

    tagwrapper = TagWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                            adminapi_token=adminapi_token)

    taglist = tagwrapper.get_many()
    return render_template('pages/admin/tag/tag_list_page.html', taglist=taglist, **kwargs)


@bp.route('/captures')
@requires_admin
def capture_list_page(adminapi_token):
    capturewrapper = CaptureWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                                    adminapi_token=adminapi_token)

    capturelist = capturewrapper.get_many()
    return render_template('pages/admin/capture/capture_list_page.html', capturelist=capturelist)


@bp.route('/users')
@requires_admin
def user_list_page(adminapi_token):
    userwrapper = UserWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                              adminapi_token=adminapi_token)

    userlist = userwrapper.get_many()
    return render_template('pages/admin/user/user_list_page.html', userlist=userlist)


@bp.route('/user/<int:userid>')
@requires_admin
def user_page(adminapi_token, userid):
    userwrapper = UserWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                              adminapi_token=adminapi_token)

    user = userwrapper.get(userid)
    return render_template('pages/admin/user/user_page.html', user=user)


@bp.route('/capture/<int:captid>/delete')
@requires_admin
def delete_capture(adminapi_token, captid):
    capturewrapper = CaptureWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                                    adminapi_token=adminapi_token)
    capturewrapper.delete(captid)
    nexturl = request.args.get('next') or url_for("adminbp.capture_list_page")
    return redirect(nexturl)

@bp.route('/tag/<int:tagid>')
@requires_admin
def tag_page(adminapi_token, tagid):
    tagwrapper = TagWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                            adminapi_token=adminapi_token)
    tag = tagwrapper.get(tagid)
    return render_template('pages/admin/tag/tag_page.html', tag=tag)


@bp.route('/tag/<int:tagid>/captures')
@requires_admin
def tag_captures_page(adminapi_token, tagid):
    tagwrapper = TagWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                            adminapi_token=adminapi_token)
    tag = tagwrapper.get(tagid)

    capturewrapper = CaptureWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                                    adminapi_token=adminapi_token)

    capturelist = capturewrapper.get_many(tag_id=tagid)

    return render_template('pages/admin/tag/tag_captures_page.html', tag=tag, capturelist=capturelist)


@bp.route('/tag/<int:tagid>/tagviews')
@requires_admin
def tag_tagviews_page(adminapi_token, tagid):
    tagwrapper = TagWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                            adminapi_token=adminapi_token)
    tag = tagwrapper.get(tagid)

    tagViewWrapper = TagViewWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                                    adminapi_token=adminapi_token)
    tagviewlist = tagViewWrapper.get_many(tagid)
    return render_template('pages/admin/tag/tag_tagviews_page.html', tag=tag, tagviewlist=tagviewlist)


@bp.route('/tag/<int:tagid>/configserial')
@requires_admin
def configserial_page(adminapi_token, tagid):
    tagwrapper = TagWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                            adminapi_token=adminapi_token)

    tag = tagwrapper.get(tagid)

    return render_template('pages/admin/tag/configserial_page.html', tag=tag)

@bp.route('tag/<int:tagid>/confignfc')
@requires_admin
def confignfc_page(adminapi_token, tagid):
    tagwrapper = TagWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                            adminapi_token=adminapi_token)

    tag = tagwrapper.get(tagid)
    return render_template('pages/admin/tag/confignfc_page.html', tag=tag)


@bp.route('/tag/<int:tagid>/simulate', methods=['GET', 'POST'])
@requires_admin
def sim_page(adminapi_token, tagid):
    simulateform = SimulateForm()

    if simulateform.frontendurl.data == None:
        simulateform.frontendurl.data = current_app.config["WSF_ORIGIN"]

    tagwrapper = TagWrapper(baseurl=current_app.config['WSB_ORIGIN'],
                            adminapi_token=adminapi_token)
    tag = tagwrapper.get(tagid)

    tagformat = int(simulateform.tagformat.data)
    simstr = tagwrapper.simulate(tagid=int(tagid),
                                 frontendurl=simulateform.frontendurl.data,
                                 nsamples=simulateform.nsamples.data,
                                 smplintervalmins=simulateform.smplintervalmins.data,
                                 tagformat=TagFormat(tagformat),
                                 usehmac=simulateform.usehmac.data,
                                 batvoltagemv=simulateform.minbatv.data,
                                 bor=simulateform.bor.data,
                                 svsh=simulateform.svsh.data,
                                 wdt=simulateform.wdt.data,
                                 misc=simulateform.misc.data,
                                 lpm5wu=simulateform.lpm5wu.data,
                                 clockfail=simulateform.clockfail.data,
                                 tagerror=simulateform.tagerror.data
                                 )
    return render_template('pages/admin/tag/sim_page.html', tag=tag, simstr=simstr, form=simulateform)

@bp.route('/signin', methods=['GET', 'POST'])
def signin():
    form = AdminTokenForm()

    if form.validate_on_submit():
        client_id = form.client_id.data
        client_secret = form.client_secret.data
        try:
            tokenstr = request_admin_token(baseurl=current_app.config['WSB_ORIGIN'],
                                           adminapi_client_id=client_id,
                                           adminapi_client_secret=client_secret)
            session["ADMINAPI_TOKEN"] = tokenstr
            flash("Token obtained", category="info")
            nexturl = request.args.get('next') or url_for('adminbp.home_page')
        except HTTPError as e:
            flash("HTTP Error {} {}".format(e.response.status_code, e.response.reason), category="error")
            nexturl = url_for('adminbp.signin')
        return redirect(nexturl)

    return render_template('pages/admin/signin_page.html', form=form, signinpage=True)

@bp.route('/signout')
def signout():
    session.pop("ADMINAPI_TOKEN")
    flash("You are signed out", category="info")
    return redirect(url_for('adminbp.signin'))