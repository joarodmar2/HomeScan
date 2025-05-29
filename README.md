# 🧠 HomeScan

Una plataforma web inteligente para la **gestión de vulnerabilidades y dispositivos conectados en estancias**, con visualización gráfica y análisis en tiempo real. Desarrollado con **Django REST** y **React + Vite**.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![React](https://img.shields.io/badge/React-18+-61dafb?logo=react)
![License](https://img.shields.io/github/license/IDEA-Research-Group/alba-assistant)
![Status](https://img.shields.io/badge/status-en%20desarrollo-yellow)

---

## 📦 Características principales

- 🔎 Panel de visualización de dispositivos y vulnerabilidades.
- 🧠 API RESTful para gestión de conexiones y análisis.
- 📊 Visualización tipo grafo de las relaciones entre dispositivos.
- 🎨 Interfaz responsive con modo claro/oscuro.
- ⚙️ Sistema modular para integración futura de IA.

---

## 🚀 Installation Guide

### 🧱 Clonar el repositorio

```bash
git clone https://github.com/IDEA-Research-Group/alba-assistant.git
cd HomeScan
```

---

### 🐍 Backend Setup (Django + REST API)

#### 1️⃣ Crear y activar entorno virtual

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

#### 2️⃣ Aplicar migraciones

```bash
python manage.py migrate
```

#### 3️⃣ Iniciar el servidor

```bash
python manage.py runserver
```

🔗 Backend disponible en: [http://localhost:8000](http://localhost:8000)  
🔌 REST API: [http://localhost:8000/vulnet/api/v1/](http://localhost:8000/vulnet/api/v1/)

---

### 💻 Frontend Setup (React + Vite)

#### 1️⃣ Entrar en el directorio del frontend

```bash
cd vulnet_frontend
```

#### 2️⃣ Instalar dependencias

```bash
npm install
```

#### 3️⃣ Ejecutar la app

```bash
npm run dev
```

🌍 Frontend disponible en: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Tecnologías utilizadas

- **Backend:** Django · Django REST Framework
- **Frontend:** React · Vite · Chakra UI · Tailwind
- **Visualización:** React D3 Graph
- **Base de Datos:** SQLite (modo desarrollo)

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

## 🤝 Contribuciones

¡Contribuciones, issues y feedback son bienvenidos!  
Abre un [Issue](https://github.com/IDEA-Research-Group/alba-assistant/issues) o haz un Fork y una Pull Request.
