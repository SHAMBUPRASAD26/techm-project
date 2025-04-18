# Food Review Application

A full-stack web application for reviewing restaurants and their dishes, built with Angular and .NET Core.

## Features

- **User Authentication**
  - Secure login and registration
  - Password reset functionality
  - JWT-based authentication
  - User profile management

- **Restaurant Management**
  - Browse restaurants with detailed information
  - Search and filter restaurants by:
    - Name and description
    - Cuisine type
    - Price range
    - Star ratings (1-5 stars)
  - View restaurant details including:
    - Images
    - Ratings and reviews
    - Menu items
    - Location and contact information

- **Review System**
  - Add and edit restaurant reviews
  - Rate restaurants with star ratings
  - View other users' reviews
  - Review management (edit/delete)

- **User Profiles**
  - View and edit personal information
  - Track review history
  - Manage favorite restaurants

## Tech Stack

### Backend (.NET Core)
- .NET Core 7.0
- Entity Framework Core
- SQL Server
- JWT Authentication
- SMTP Email Service
- RESTful API

### Frontend (Angular)
- Angular 16
- Bootstrap 5
- Angular Material
- RxJS
- Angular Forms
- Bootstrap Icons

## Prerequisites

- Node.js (v16 or later)
- .NET Core SDK 7.0
- SQL Server
- Visual Studio Code or Visual Studio 2022

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Update the connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Your_SQL_Server_Connection_String"
   }
   ```

3. Update email settings in `appsettings.json`:
   ```json
   "EmailSettings": {
     "SmtpServer": "smtp.gmail.com",
     "Port": 587,
     "Username": "your-email@gmail.com",
     "Password": "your-app-password"
   }
   ```

4. Install dependencies and run the application:
   ```bash
   dotnet restore
   dotnet run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URL in `environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api'
   };
   ```

4. Run the development server:
   ```bash
   ng serve
   ```

## Project Structure

```
techm-project/
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Data/
│   └── appsettings.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── models/
│   │   ├── assets/
│   │   └── environments/
│   └── package.json
└── README.md
```

## Troubleshooting

### Database Connection Issues
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- Ensure database exists and migrations are applied

### Email Service Issues
- Verify SMTP settings
- Check email credentials
- Ensure proper firewall settings

### API Connection Issues
- Verify backend is running
- Check CORS settings
- Validate API URL in frontend environment

### Frontend Issues
- Clear browser cache
- Check console for errors
- Verify all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the project maintainers. 