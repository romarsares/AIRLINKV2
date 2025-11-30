# AirLink System

Smart bracelet-based boarding verification system for airports that synchronizes passenger and flight data between wearable devices, local servers, and central dashboards.

## System Overview

AirLink provides seamless communication between airports, airlines, and passengers using IoT bracelets that sync real-time flight information, support digital boarding, and enhance accessibility for all travelers.

**Deployment**: Local airport infrastructure with external airline API integration only.

### Core Components

- **Bracelet Device**: Stores passenger & flight data, handles local verification
- **AirLink Server**: Main application logic, database management, REST API
- **Web Dashboard**: Admin interface for monitoring flight and boarding status

## Quick Start

### Prerequisites

- Node.js (v18+)
- MySQL (v8.0+)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/romarsares/AIRLINKV2.git
cd AIRLINKV2
```

2. Install dependencies
```bash
npm install
```

3. Set up database
```bash
# Create MySQL databases
mysql -u root -p < database/setup.sql
```

4. Configure environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Start development servers
```bash
# Backend server
npm run dev:backend

# Frontend dashboard (in another terminal)
npm run dev:frontend
```

## Project Structure

```
AIRLINKV2/
├── backend/          # Server application
├── frontend/         # Web dashboard
├── database/         # Database schemas and migrations
├── docs/            # Documentation
├── tests/           # Integration tests
├── scripts/         # Utility scripts
└── config/          # Environment configurations
```

## Development Workflow

Follow the [Development Workflow](airlink-development-workflow.md) for detailed step-by-step development process.

## API Documentation

The system provides 9 core API endpoints organized by priority:

### Priority 1 (Critical Operations)
- `POST /bookings` - Create flight booking
- `POST /bracelets/assign` - Assign bracelet to passenger  
- `POST /bracelets/verify` - Verify boarding eligibility

### Priority 2-9 (Supporting Operations)
- Booking retrieval, status updates, system monitoring
- See [API Documentation](docs/api/) for complete details

## Security

- SHA-256 password hashing
- JWT token authentication
- HTTPS encryption
- Role-based access control
- Input validation and sanitization

## Login Credentials

### Default Test Accounts
- **Admin**: `admin` / `admin12354`
- **Operator**: `operator` / `operator123`

## Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
```

## Deployment

See [Deployment Guide](docs/deployment/) for production setup instructions.

## Contributing

1. Follow the development workflow
2. Write tests for new features
3. Update documentation
4. Submit pull requests

## License

MIT License - see LICENSE file for details

## Support

For technical support and documentation, see the [docs/](docs/) directory.