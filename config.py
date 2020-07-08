import os

DEFAULT_IDP_PROTOCOL = "https://"
DEFAULT_IDP_HOST = "localhost"
DEFAULT_IDP_PORT = 3000

DEFAULT_WSB_PROTOCOL = "https://"
DEFAULT_WSB_HOST = "localhost"
DEFAULT_WSB_PORT = 5000

DEFAULT_WSF_PROTOCOL = "http://"
DEFAULT_WSF_HOST = "localhost"
DEFAULT_WSF_PORT = 5001

IDP_PROTOCOL = os.getenv('IDP_PROTOCOL', DEFAULT_IDP_PROTOCOL)
IDP_HOST = os.getenv('IDP_HOST', DEFAULT_IDP_HOST)
IDP_PORT = os.getenv('IDP_PORT', DEFAULT_IDP_PORT)
IDP_ORIGIN = '{idp_protocol}{idp_host}:{idp_port}'.format(idp_protocol=IDP_PROTOCOL,
                                                          idp_host=IDP_HOST,
                                                          idp_port=str(IDP_PORT))

WSB_PROTOCOL = os.getenv('WSB_PROTOCOL', DEFAULT_WSB_PROTOCOL)
WSB_HOST = os.getenv('WSB_HOST', DEFAULT_WSB_HOST)
WSB_PORT = os.getenv('WSB_PORT', DEFAULT_WSB_PORT)
WSB_ORIGIN = '{wsb_protocol}{wsb_host}:{wsb_port}'.format(wsb_protocol=WSB_PROTOCOL,
                                                          wsb_host=WSB_HOST,
                                                          wsb_port=str(WSB_PORT))

WSF_PROTOCOL = os.getenv('WSF_PROTOCOL', DEFAULT_WSF_PROTOCOL)
WSF_HOST = os.getenv('WSF_HOST', DEFAULT_WSF_HOST)
WSF_PORT = os.getenv('WSF_PORT', DEFAULT_WSF_PORT)
WSF_ORIGIN = '{wsf_protocol}{wsf_host}:{wsf_port}'.format(wsf_protocol=WSF_PROTOCOL,
                                                          wsf_host=WSF_HOST,
                                                          wsf_port=str(WSF_PORT))

AUTH0_CLIENTID = os.environ['AUTH0_CLIENTID']
AUTH0_CLIENTSECRET = os.environ["AUTH0_CLIENTSECRET"]

AUTH0_API_UNIQUEID = os.environ["AUTH0_API_UNIQUEID"]

STATIC_URL = os.environ['STATIC_URL']
BASE_URL = os.environ['BASE_URL']
SECRET_KEY = os.urandom(16)
