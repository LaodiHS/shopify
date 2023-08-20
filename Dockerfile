FROM node:18-alpine

RUN echo "Docker Build Starting..."

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY="f844c74769e61de9647977a2ed79bd3d"
ENV SHOPIFY_API_SECRET="87fd6b6d808b66234e300255fec6263b"
EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]



# FROM node:18-alpine

# ARG SHOPIFY_API_KEY
# ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
# EXPOSE 8081
# WORKDIR /app
# COPY web .
# RUN npm install
# RUN cd frontend && npm install && npm run build
# CMD ["npm", "run", "serve"]