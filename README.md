# ShapeControl

 This app helps you control your calorie intake. Once authenticated, you can create your own calorie plan based on your age, height, weight, and activity level.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Alex-skigo99/DI_FP_ShapeControl.git
```

Go to the  directory

```bash
  cd DI_FP_ShapeControl
```

Create .env with environment variables

Build frontend

```bash
  cd client
  sudo npm run build
```
Start backend

```bash
  cd ..
  sudo nodemon build/app.js
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.
Database on Neon.

`DATABASE_URL`

`ACCESS_TOKEN_SECRET`

`REFRESH_TOKEN_SECRET`

`OPENAI_API_KEY`


## Tech Stack

**Client:** 
TS, React, Redux 

**Server:** 
Node.js, Express, Knex

**Database:** 
PostgreSQL on Neon.tech

**Deploy:** 
render.com

## Authors

- [@Alex-skigo99](https://www.github.com/Alex-skigo99)



## Production

https://di-fp-shapecontrol.onrender.com/
