Installation
Clone the repository:
git clone https://github.com/IDEA-Research-Group/alba-assistant.git
cd alba-assistant
Create a virtual environment for the backend:
python -m venv venv
Activate the virtual environment:
On Windows:

.\venv\Scripts\activate
On macOS/Linux:

source venv/bin/activate
Backend Setup
Run migrations:
python manage.py migrate
Start the server:
python manage.py runserver
The backend will be available at http://localhost:8000.

Rest-API: http://localhost:8000/vulnet/api/v1/

Frontend Setup
Navigate to the frontend directory:
cd vulnet_frontend
Install frontend dependencies:
npm install
Start the React application:
 npm run dev
The frontend will be available at http://localhost:5173.
