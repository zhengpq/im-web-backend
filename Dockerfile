# # syntax=docker/dockerfile:1

# # Comments are provided throughout this file to help you get started.
# # If you need more help, visit the Dockerfile reference guide at
# # https://docs.docker.com/go/dockerfile-reference/

# ARG NODE_VERSION=18.15.0

# FROM node:${NODE_VERSION}-alpine

# # Use production node environment by default.
# ENV NODE_ENV production


# WORKDIR .

# CMD npm install

# # Download dependencies as a separate step to take advantage of Docker's caching.
# # Leverage a cache mount to /root/.npm to speed up subsequent builds.
# # Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# # into this layer.
# # RUN --mount=type=bind,source=package.json,target=package.json \
# #     --mount=type=bind,source=package-lock.json,target=package-lock.json \
# #     --mount=type=cache,target=/root/.npm \
# #     npm ci --omit=dev

# # Run the application as a non-root user.
# USER node

# # Copy the rest of the source files into the image.
# # COPY . .

# # Expose the port that the application listens on.
# EXPOSE 8000

# # Run the application.
# CMD npm run dev

FROM node:18.15.0

EXPOSE 8000

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# 安装 PM2
RUN npm install pm2 -g

# 复制项目源代码
COPY . .

# 构建项目
RUN npm run build


# 设置环境变量
ARG SECRET_ID
ARG SECRET_KEY
ARG DB_NAME
ARG DB_USER_NAME
ARG DB_PASSWORD
ARG COS_BUCKET
ARG COS_REGION
ENV SECRET_ID=$SECRET_ID
ENV SECRET_KEY=$SECRET_KEY
ENV DB_NAME=$DB_NAME
ENV DB_USER_NAME=$DB_USER_NAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV COS_BUCKET=$COS_BUCKET
ENV COS_REGION=$COS_REGION

#CMD ["node", "main.js"]
CMD ["pm2-runtime", "./ecosystem.config.js", "--env production"]