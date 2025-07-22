# ✈️ FlightBoard Server

ASP.NET Core Web API that manages flight data and provides real-time updates via SignalR.

---

## 📦 Technologies

- **ASP.NET Core 8**
- **Entity Framework Core**
- **SignalR**
- **SQL Server LocalDB**

---

## 🚀 Getting Started

### ✅ Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server LocalDB (or modify `appsettings.json`)

### 🛠️ Setup

### bash
cd server
dotnet restore
dotnet ef database update
dotnet run

By default, the server runs at: http://localhost:5106

### 🌐 Endpoints
Method	Route	Description
GET	/api/flights	Get all flights
GET	/api/flights/search	Get filtered flights
POST	/api/flights	Add a new flight
DELETE	/api/flights/{id}	Delete a flight
Hub	/flighthub	SignalR real-time endpoint

### 📚 Libraries Used
Microsoft.AspNetCore.SignalR

Microsoft.EntityFrameworkCore

Microsoft.EntityFrameworkCore.SqlServer

Microsoft.AspNetCore.Cors

Swashbuckle.AspNetCore (for Swagger)

### 🛠️ Architectural Notes
SignalR broadcasts live flight status updates to connected clients.

Filtered flights are fetched using query params: status and destination.

Status logic is based on current server time and DepartureTime.

