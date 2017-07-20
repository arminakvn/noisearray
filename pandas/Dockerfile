FROM alpine
MAINTAINER aarmin@mit.edu

ENV PANDAS_VERSION 0.18.1
RUN apk add --no-cache python-dev py-pip && \
    apk add --no-cache --virtual .build-deps g++ && \
    ln -s /usr/include/locale.h /usr/include/xlocale.h && \
    pip install numpy==1.11.1 && \
    pip install psycopg2 && \
    pip install sqlalchemy && \
    pip install dbfread && \
    pip install requests && \
    pip install pandas==$PANDAS_VERSION
RUN apk add --no-cache freetype-dev libpng-dev && \
    pip install jupyter==1.0.0 matplotlib==1.5.1

EXPOSE 8888
CMD jupyter notebook --ip 0.0.0.0 --no-browser --NotebookApp.base_url=/
