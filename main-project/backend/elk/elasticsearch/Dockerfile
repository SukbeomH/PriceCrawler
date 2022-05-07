FROM elasticsearch:7.17.3

WORKDIR /myfolder/
COPY ./plugin/analysis-nori-7.17.3.zip /myfolder/

RUN mkdir /bin/elasticsearch-plugin
RUN ./bin/elasticsearch-plugin install ./analysis-nori-7.17.3.zip

