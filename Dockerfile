#pull this image from playwright site
FROM mcr.microsoft.com/playwright:v1.44.1-jammy

#create new directory as working directory, copy everything from root/source to this directory
RUN mkdir /app
WORKDIR /app
COPY . /app

#install all dependencies from package.json, install playwright(with browsers)
RUN npm install --force
RUN npx playwright install