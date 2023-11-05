FROM node:18-alpine
 
ARG SHOPIFY_API_KEY
RUN apk add --no-cache git
ENV SHOPIFY_API_KEY="e39c559d5a6b026c4626628bb9c1959b"
ENV SHOPIFY_API_SECRET="a4ca9424d4961d3f0789eb75f8fd8e08"
ENV APP_ENV="production"
ENV NODE_ENV="production"
ENV SCOPES="write_products,read_content,write_content"
ENV OPEN_AI_SECRET_KEY="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"
ENV REDIS_LAB_TEST_ENV="redis://default:au34F3z3Bn8izOjWQ9zPITaQ6MYTE3CP@redis-12960.c60.us-west-1-2.ec2.cloud.redislabs.com:12960"
ENV REDIS_LAB_PRODUCTION="redis://default:z62jRMRCqkZRFoX6YDWmzIRdQCGRkWK0@redis-12145.c309.us-east-2-1.ec2.cloud.redislabs.com:12145"
ENV REDIS_API_UPSTASH_PASSWORD_TEST_ENV="rediss://default:3a837f2df9094869bed83d7a69e9f32a@engaging-moose-36430.upstash.io:36430"
ENV REDIS_API_UPSTASH_PASSWORD="rediss://default:ccd76f3b7a024da2aa51df1950d1c80b@immune-sole-44892.upstash.io:44892"
ENV REDIS_API_PASSWORD="au34F3z3Bn8izOjWQ9zPITaQ6MYTE3CP"
EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]


# FROM node:18-alpine

# # RUN echo "Docker Build Starting..."

# ARG SHOPIFY_API_KEY
# # Install Git
# RUN apk add --no-cache git
# ENV SHOPIFY_API_KEY="e39c559d5a6b026c4626628bb9c1959b"
# ENV SHOPIFY_API_SECRET="a4ca9424d4961d3f0789eb75f8fd8e08"
# EXPOSE 8081
# WORKDIR /app
# COPY web .
# RUN npm install -g npm@10.2.3
# RUN npm install
# RUN cd frontend && npm install && npm run build
# CMD ["npm", "run", "serve"]



# FROM node:18-alpine

# ARG SHOPIFY_API_KEY
# ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
# EXPOSE 8081
# WORKDIR /app
# COPY web .
# RUN npm install
# RUN cd frontend && npm install && npm run build
# CMD ["npm", "run", "serve"]