Contacts API

api/contacts :

GET api/contacts (All contacts)

GET api/contacts/:id (find contact by id)

POST api/contacts (create new contact by contact schema ./schemas/joiSchema)

DELETE api/contacts/:id (delete contact by id)

PUT api/contacts/:id (update contact)

PATCH api/contacts/:id/favorite (update favorite status)

api/users :

POST api/users/register (register new user by user schema ./schemas/User)

GET api/users/verify/:verificationCode (verify email)

POST api/users/verify (resend verify email)

POST api/users/login (login)

POST api/users/logout (logout)

GET api/users/current (get current user)

PATCH api/users/avatars (update user avatar)
