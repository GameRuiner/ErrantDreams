# Errant Dreams

## Stack

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Django](https://www.djangoproject.com/) - Django makes it easier to build better web apps more quickly and with less code.
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Typescript](https://www.typescriptlang.org/) - JavaScript with syntax for types.

## Project structure

```
$PROJECT_ROOT
│   
├── src/backend # backend file
│   
├── src/ui # React files
│   
├── src/templates # Django Templates
│   
├── src/staticfiles # Django Static Files
```
---

### Run the Code

#### For Backend

- Create Virtual Environment for Python

```bash
python3 -m venv venv
```

- Activate Virtual Environment

```bash
source venv/bin/activate
```

- Install Dependencies

```bash
cd src
pip install -r requirements.txt
```

- Make Migrations

```bash
cd src
python manage.py makemigrations
python manage.py migrate
```
- Run Server

```bash
cd src
python manage.py runserver
```

####  For Frontend

- Install Dependencies

```bash
cd src/ui
pnpm i
```
- Run Vite

```bash
cd src/ui
pnpm dev
```

- For production 

```bash
cd src/ui
pnpm collectstatic
```
