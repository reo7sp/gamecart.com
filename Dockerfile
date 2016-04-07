FROM node
MAINTAINER Oleg Morozenkov

RUN apt-get update && apt-get install -y rake

WORKDIR /app
COPY . .
RUN rake get_deps

EXPOSE 80
CMD ["rake", "debug"]
