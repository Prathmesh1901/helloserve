import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'USER', vehicleType: '', vehicleImage: null });
  const [newSpace, setNewSpace] = useState({ 
    address: '', 
    status: 'AVAILABLE', 
    ownerId: '', 
    pricePerHour: '', 
    parkingType: 'COVERED',
    maxVehicleSize: 'CAR',
    amenities: [],
    description: '',
    image: null 
  });

  // FIXED: Point to the backend server
  const API_URL = 'http://localhost:8081';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const usersResponse = await fetch(`${API_URL}/api/users`);
      if (!usersResponse.ok) throw new Error('Failed to fetch users');
      const usersData = await usersResponse.json();
      setUsers(usersData);
      
      const spacesResponse = await fetch(`${API_URL}/api/parking-spaces`);
      if (spacesResponse.ok) {
        const spacesData = await spacesResponse.json();
        setParkingSpaces(spacesData);
      }
      
      const bookingsResponse = await fetch(`${API_URL}/api/bookings`);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending user data:', newUser);
      
      const formData = new FormData();
      formData.append('name', newUser.name);
      formData.append('email', newUser.email);
      formData.append('password', newUser.password);
      formData.append('role', newUser.role);
      
      if (newUser.role === 'USER' && newUser.vehicleType) {
        formData.append('vehicleType', newUser.vehicleType);
        if (newUser.vehicleImage) {
          formData.append('vehicleImage', newUser.vehicleImage);
        }
      }
      
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        body: formData, // Remove Content-Type header for FormData
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        setNewUser({ name: '', email: '', password: '', role: 'USER', vehicleType: '', vehicleImage: null });
        fetchData(); // Refresh data
        alert('User added successfully!');
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        alert(`Failed to add user: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Network error adding user:', error);
      alert(`Network error adding user: ${error.message}`);
    }
  };

  const addParkingSpace = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('address', newSpace.address);
      formData.append('status', newSpace.status);
      formData.append('ownerId', newSpace.ownerId);
      formData.append('pricePerHour', newSpace.pricePerHour);
      formData.append('parkingType', newSpace.parkingType);
      formData.append('maxVehicleSize', newSpace.maxVehicleSize);
      formData.append('description', newSpace.description);
      formData.append('amenities', JSON.stringify(newSpace.amenities));
      
      if (newSpace.image) {
        formData.append('image', newSpace.image);
      }
      
      const response = await fetch(`${API_URL}/api/parking-spaces`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setNewSpace({ 
          address: '', 
          status: 'AVAILABLE', 
          ownerId: '', 
          pricePerHour: '', 
          parkingType: 'COVERED',
          maxVehicleSize: 'CAR',
          amenities: [],
          description: '',
          image: null 
        });
        fetchData(); // Refresh data
        alert('Parking space added successfully!');
      } else {
        const errorText = await response.text();
        alert(`Failed to add parking space: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error adding parking space:', error);
      alert('Error adding parking space');
    }
  };

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (error) {
    return (
      <div className="App">
        <h1>Connection Error</h1>
        <p>Cannot connect to backend: {error}</p>
        <p>Make sure your Spring Boot server is running on port 8081</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Parking Space Booking System</h1>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'add-user' ? 'active' : ''} 
            onClick={() => setActiveTab('add-user')}
          >
            Add User
          </button>
          <button 
            className={activeTab === 'add-space' ? 'active' : ''} 
            onClick={() => setActiveTab('add-space')}
          >
            Add Parking Space
          </button>
        </nav>
      </header>
      
      <main>
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="stats">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{users.length}</p>
              </div>
              <div className="stat-card">
                <h3>Parking Spaces</h3>
                <p className="stat-number">{parkingSpaces.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <p className="stat-number">{bookings.length}</p>
              </div>
            </div>

            <section>
              <h2>Users</h2>
              {users.length > 0 ? (
                <div className="data-grid">
                  {users.map(user => (
                    <div key={user.id} className="data-card">
                      <h4>{user.name}</h4>
                      <p>Email: {user.email}</p>
                      <p>Role: <span className={`role ${user.role.toLowerCase()}`}>{user.role}</span></p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No users found</p>
              )}
            </section>

            <section>
              <h2>Parking Spaces</h2>
              {parkingSpaces.length > 0 ? (
                <div className="data-grid">
                  {parkingSpaces.map(space => (
                    <div key={space.id} className="data-card">
                      <h4>Space #{space.id}</h4>
                      <p>Address: {space.address}</p>
                      <p>Status: <span className={`status ${space.status.toLowerCase()}`}>{space.status}</span></p>
                      <p>Owner ID: {space.ownerId}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No parking spaces found</p>
              )}
            </section>

            <section>
              <h2>Recent Bookings</h2>
              {bookings.length > 0 ? (
                <div className="data-grid">
                  {bookings.map(booking => (
                    <div key={booking.id} className="data-card">
                      <h4>Booking #{booking.id}</h4>
                      <p>Start: {booking.startTime}</p>
                      <p>End: {booking.endTime}</p>
                      <p>Renter ID: {booking.renterId}</p>
                      <p>Space ID: {booking.spaceId}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No bookings found</p>
              )}
            </section>
          </div>
        )}

        {activeTab === 'add-user' && (
          <section className="form-section">
            <h2>Add New User</h2>
            <form onSubmit={addUser} className="form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="USER">Car Owner (Renter)</option>
                  <option value="OWNER">Parking Space Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              
              {newUser.role === 'USER' && (
                <>
                  <div className="form-group">
                    <label>Vehicle Type:</label>
                    <select
                      value={newUser.vehicleType}
                      onChange={(e) => setNewUser({...newUser, vehicleType: e.target.value})}
                      required={newUser.role === 'USER'}
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="SEDAN">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="HATCHBACK">Hatchback</option>
                      <option value="MOTORCYCLE">Motorcycle</option>
                      <option value="TRUCK">Truck</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Vehicle Image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewUser({...newUser, vehicleImage: e.target.files[0]})}
                      required={newUser.role === 'USER'}
                    />
                  </div>
                </>
              )}
              
              <button type="submit" className="submit-btn">Add User</button>
            </form>
          </section>
        )}

        {activeTab === 'add-space' && (
          <section className="form-section">
            <h2>Add New Parking Space</h2>
            <form onSubmit={addParkingSpace} className="form">
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  value={newSpace.address}
                  onChange={(e) => setNewSpace({...newSpace, address: e.target.value})}
                  placeholder="Enter full address with landmarks"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={newSpace.description}
                  onChange={(e) => setNewSpace({...newSpace, description: e.target.value})}
                  placeholder="Describe your parking space (security, accessibility, etc.)"
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Price per Hour (₹):</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newSpace.pricePerHour}
                  onChange={(e) => setNewSpace({...newSpace, pricePerHour: e.target.value})}
                  placeholder="e.g. 50"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Parking Type:</label>
                <select
                  value={newSpace.parkingType}
                  onChange={(e) => setNewSpace({...newSpace, parkingType: e.target.value})}
                >
                  <option value="COVERED">Covered (Garage/Shed)</option>
                  <option value="OPEN">Open (Outdoor)</option>
                  <option value="BASEMENT">Basement</option>
                  <option value="ROOFTOP">Rooftop</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Maximum Vehicle Size:</label>
                <select
                  value={newSpace.maxVehicleSize}
                  onChange={(e) => setNewSpace({...newSpace, maxVehicleSize: e.target.value})}
                >
                  <option value="MOTORCYCLE">Motorcycle Only</option>
                  <option value="HATCHBACK">Hatchback/Small Car</option>
                  <option value="SEDAN">Sedan/Medium Car</option>
                  <option value="SUV">SUV/Large Car</option>
                  <option value="TRUCK">Truck/Commercial</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Amenities:</label>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px'}}>
                  {['SECURITY_CAMERA', 'GUARD', 'ELECTRIC_CHARGING', 'WASHROOM', '24x7_ACCESS', 'CAR_WASH'].map(amenity => (
                    <label key={amenity} style={{display: 'flex', alignItems: 'center', fontSize: '14px'}}>
                      <input
                        type="checkbox"
                        checked={newSpace.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewSpace({...newSpace, amenities: [...newSpace.amenities, amenity]});
                          } else {
                            setNewSpace({...newSpace, amenities: newSpace.amenities.filter(a => a !== amenity)});
                          }
                        }}
                        style={{marginRight: '5px'}}
                      />
                      {amenity.replace('_', ' ')}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Parking Space Image: *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewSpace({...newSpace, image: e.target.files[0]})}
                  required
                />
                <small style={{color: '#666', fontSize: '12px'}}>
                  Upload a clear photo of your parking space
                </small>
              </div>
              
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={newSpace.status}
                  onChange={(e) => setNewSpace({...newSpace, status: e.target.value})}
                >
                  <option value="AVAILABLE">Available for Rent</option>
                  <option value="OCCUPIED">Currently Occupied</option>
                  <option value="MAINTENANCE">Under Maintenance</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Owner:</label>
                <select
                  value={newSpace.ownerId}
                  onChange={(e) => setNewSpace({...newSpace, ownerId: e.target.value})}
                  required
                >
                  <option value="">Select Owner</option>
                  {users.filter(user => user.role === 'OWNER' || user.role === 'ADMIN').map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className="submit-btn">Add Parking Space</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;