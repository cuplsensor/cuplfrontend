from flask import Blueprint, render_template, redirect, flash, url_for, request, send_file
from flask_qrcode import QRcode
from .forms.boxes import AddBoxForm
from wsapiwrapper.admin.box import BoxWrapper
from wsapiwrapper.admin.capture import CaptureWrapper
from wsapiwrapper.admin.user import UserWrapper
from wsapiwrapper.admin.boxview import BoxViewWrapper
from .config import WSB_ORIGIN, ADMINAPI_CLIENTID, ADMINAPI_CLIENTSECRET


# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('dashboard', __name__, template_folder='templates', static_folder='static', static_url_path='/admin/static')


@bp.route('/')
def home_page():
    return redirect(url_for('dashboard.box_list_page'))


@bp.route('/boxes', methods=['GET', 'POST'])
def box_list_page(**kwargs):
    form = AddBoxForm()
    boxwrapper = BoxWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    if form.validate_on_submit():
        boxwrapper.post(boxid=form.box_id.data)
        flash("Box added")
        return redirect(url_for('dashboard.home_page'))

    boxlist = boxwrapper.get_many()

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
    boxwrapper = BoxWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    box = boxwrapper.get(boxid)
    return render_template('pages/box/box_page.html', box=box)


@bp.route('/box/<int:boxid>/captures')
def box_captures_page(boxid):
    boxwrapper = BoxWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    box = boxwrapper.get(boxid)

    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN,
                                    adminapi_client_id=ADMINAPI_CLIENTID,
                                    adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    capturelist = capturewrapper.get_many(box_id=boxid)

    return render_template('pages/box/box_captures_page.html', box=box, capturelist=capturelist)


@bp.route('/box/<int:boxid>/boxviews')
def box_boxviews_page(boxid):
    boxwrapper = BoxWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    box = boxwrapper.get(boxid)

    boxviewwrapper = BoxViewWrapper(baseurl=WSB_ORIGIN,
                                    adminapi_client_id=ADMINAPI_CLIENTID,
                                    adminapi_client_secret=ADMINAPI_CLIENTSECRET)
    boxviewlist = boxviewwrapper.get_many(boxid)
    return render_template('pages/box/box_boxviews_page.html', box=box, boxviewlist=boxviewlist)


@bp.route('/box/<int:boxid>/simulate')
def sim_page(boxid):
    boxwrapper = BoxWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSECRET)

    box = boxwrapper.get(boxid)
    simstr = boxwrapper.simulate(boxid=int(boxid), frontendurl="http://localhost:8080")
    return render_template('pages/box/sim_page.html', box=box, simstr=simstr)


@bp.route("/qrcode", methods=["GET"])
def get_qrcode():
    # please get /qrcode?data=<qrcode_data>
    data = request.args.get("data", "")
    return send_file(QRcode(data, mode="raw"), mimetype="image/png")


@bp.route('/signin')
def signin():
    response = render_template('pages/signin_page.html', **kwargs)
    return response
