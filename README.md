# To Do List + Back Office Panel (connected via one Firebase project)

This package contains two separate React apps that share **one Firebase project**,
so anything a user does in the To Do List app immediately shows up in the Back
Office Panel.

```
todo-app/         React Task 6 - user-facing To Do List app
backoffice-app/   React Task 7 - admin Back Office Panel
firestore.rules   starter security rules (see note below)
```

## 1. Create one Firebase project for both apps

1. Go to the Firebase console and create a new project.
2. Build > Authentication > Sign-in method > enable **Email/Password**.
3. Build > Firestore Database > Create database (start in test mode while developing).
4. Project settings > General > "Your apps" > Add app > Web app. Copy the
   `firebaseConfig` object it gives you.
5. Paste that exact same config into **both**:
   - `todo-app/src/firebase.js`
   - `backoffice-app/src/firebase.js`

Because both apps point at the same Firebase project, the Back Office Panel
reads the exact users / lists / tasks that the To Do app writes - that is the
"connection" between the two projects.

## 2. Firestore data model (shared by both apps)

| Collection | Fields |
|---|---|
| `users`     | email, password, signupTime, ip |
| `taskLists` | title, createdBy (email), createdAt, updatedAt |
| `tasks`     | title, description, dueDate, priority (High/Medium/Low), listId, createdAt |

## 3. Run the To Do List app (Task 6)

```
cd todo-app
npm install
npm run dev
```

Open the printed local URL. Sign up with an email/password, create lists,
add tasks, and drag cards between lists or between the High/Medium/Low lanes
inside a list to change priority.

## 4. Run the Back Office Panel (Task 7)

```
cd backoffice-app
npm install
npm run dev
```

Log in with the static credentials defined in `backoffice-app/src/pages/Login.jsx`
(default `admin` / `admin123` - change these before sharing the app with
anyone else). You will see three menu items - Users, Task Lists, Tasks - each
backed by a live read of the same Firestore collections the To Do app writes to.

## 5. Security notes (please read)

- The spec asks the Users grid to display the raw password, so this project
  stores it in Firestore in plain text for that purpose. That is not safe for
  a real product - if you ever go beyond this exercise, drop the stored
  password field and rely only on Firebase Authentication.
- `firestore.rules` in this folder is a permissive starter so both apps work
  immediately. Before deploying anywhere public, tighten it (e.g. only the
  back office admin should be able to read the `users` collection).
- The Back Office login is a hardcoded pair of constants, per the task spec
  ("static as of now") - it is not real authentication and should not gate
  anything sensitive in production.
