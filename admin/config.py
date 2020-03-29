import os


DEFAULT_WSB_PROTOCOL = "https://"
DEFAULT_WSB_HOST = "localhost"
DEFAULT_WSB_PORT = 5000

DEFAULT_ADMINAPI_AUDIENCE = "default_adminapi_audience"
DEFAULT_ADMINAPI_CLIENTID = "default_adminapi_clientid"



WSB_PROTOCOL = os.getenv('WSB_PROTOCOL', DEFAULT_WSB_PROTOCOL)
WSB_HOST = os.getenv('WSB_HOST', DEFAULT_WSB_HOST)
WSB_PORT = os.getenv('WSB_PORT', DEFAULT_WSB_PORT)
WSB_ORIGIN = '{wsb_protocol}{wsb_host}:{wsb_port}'.format(wsb_protocol=WSB_PROTOCOL,
                                                          wsb_host=WSB_HOST,
                                                          wsb_port=str(WSB_PORT))


AUTH0_API_UNIQUEID = os.environ["AUTH0_API_UNIQUEID"]

ADMINAPI_AUDIENCE = os.getenv('ADMINAPI_AUDIENCE', DEFAULT_ADMINAPI_AUDIENCE)
ADMINAPI_CLIENTID = os.getenv('ADMINAPI_CLIENTID', DEFAULT_ADMINAPI_CLIENTID)
ADMINAPI_CLIENTSECRET = os.environ['ADMINAPI_CLIENTSECRET']

STATIC_URL = os.environ['STATIC_URL']
BASE_URL = os.environ['BASE_URL']
SECRET_KEY = os.urandom(16)
