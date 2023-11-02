FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
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