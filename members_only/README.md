# Members only

Goal: Implement "members only" message board where posts are anonymous if you are not a member or admin. Make register and login form, use sessions to remeber users.

Notes:
- 3 roles (user, member, admin), have different page layout depending on role (admin sees delete button)
- passport.js for authentication and sessions
- dark/light theme
- pagination
  
Tech: JS, Express.js, ejs, expresss-validator, passport.js, faker, express-session, pg, tailwindcss

## Run project
```bash
npm install
docker-compose up -d
# generate tailwind css file
npm run dev:css
# run server
npm run dev
```

## Image
### Page as an user
![image](https://github.com/user-attachments/assets/8fedf16f-b960-48c6-9fe5-617a150fb2c3)

### Page as an admin or member (we can see usernames)
![image](https://github.com/user-attachments/assets/cf292054-9a66-41ab-b3ed-a3cd9c1d36fd)

### Delete post button for admin
![image](https://github.com/user-attachments/assets/f5af8aa4-0e38-4a97-8511-4e6fb7ce32de)
