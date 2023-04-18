# DWP ALUS

Department for Work and Pensions - Acronym Lookup Service

by Andrew Martin-Hirsch

###Features:  

-SQL Database - 3 tables, users, suggestions, acronyms  
-Register / Login with password encryption and field-level validation  
-Logging out / destroying current session  
-Users can view the list without logging in  
-Regular accounts can contribute suggestions to the list that are checked by admin users  
-Admin users can add / delete / edit the suggestions before adding them to the list  

###Dependencies and versions:

ministryofjustice/frontend: ^1.6.5,
axios: ^1.3.4,
bcryptjs: ^2.4.3,
chai: ^4.3.7,
chai-as-promised: ^7.1.1,
cors: ^2.8.5,
dotenv: ^10.0.0,
ejs: ^3.1.8,
express: ^4.18.2,
express-session: ^1.17.3,
freemarker: ^2.0.1,
govuk-frontend: ^4.5.0,
jsonwebtoken: ^8.5.1,
md5: ^2.3.0,
mocha: ^10.2.0,
nodemon: ^2.0.12,
nunjucks: ^3.2.3,
path: ^0.12.7,
react: ^18.2.0,
rewire: ^6.0.0,
sass: ^1.58.3,
sinon: ^15.0.3,
sinon-chai: ^3.7.0,
sqlite: ^4.1.2,
sqlite3: ^5.0.2

###Steps to install:

1. Clone the repository down.
2. Install dependencies
3. Create a sqlite3 database source titled 'alus.db' within the root folder of the project.
4. Run the application with 'npm start' and visit the url 'localhost:3004'

