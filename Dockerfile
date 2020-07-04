# Based on
# https://medium.com/@greut/minimal-python-deployment-on-docker-with-uwsgi-bc5aa89b3d35
# but not using Alpine because this distribution is not compatible with Python manylinux binaries.
FROM python:3.8.2-slim-buster as base

ENV WSF_PORT=5000

COPY ./requirements.txt .
# Install all requirements
RUN pip3 install --extra-index-url https://testpypi.python.org/pypi -r requirements.txt

FROM base
# Create a working directory named app
WORKDIR /app
# Copy everything into the working directory
COPY . .
# Change ownership of the app folder to match the user running uwsgi
RUN chown -R www-data:www-data /app

# uWSGI will be available on this port
EXPOSE $WSF_PORT

CMD [ "uwsgi", "--uid", "uwsgi", \
               "--ini",  "uwsgi.ini"]
