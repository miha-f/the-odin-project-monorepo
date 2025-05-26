# Mini message board

Goal: Implement message board, with option to add new messages.

Notes:
  - used materialize-css for styling
  - implemented pagination
  - MVC (models, views, controlles) pattern
  - using middleware to automatically call layout.ejs for every page
  - using prisma ORM with postgres for permanent message storage
  - generating "fake" data with faker.js
  
Tech: JS, Express.js, ejs, expresss-validator, prisma, meterialize-css, faker

## Run project
```bash
npm install
npm run generate:db
docker-compose up -d
npm run seed
npm run dev
```

## Image
### Home
![image](https://github.com/user-attachments/assets/54cf54e3-3b01-4e21-87e9-9b2aa5424b3c)

### Add new message form
![image](https://github.com/user-attachments/assets/15c84b9c-4e27-4376-ac9c-4b39ace4eb0f)
