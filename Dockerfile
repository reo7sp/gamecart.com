FROM node
MAINTAINER Oleg Morozenkov

RUN apt-get update && apt-get install -y rake

COPY . .
RUN rake get_deps

CMD ["rake", "debug"]
