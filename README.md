## **Getting Started**

Follow these steps to set up the project locally:

### **1. Clone the Repository**
```bash
git clone https://github.com/endalk-tamru/gameon.git
cd gameon
```
### **2. Install Dependencies**
Make sure you have Node.js and npm installed. Then, run the following command to install all required packages:
```bash
npm install
```
### **3. Set Environment Variables**
Create a .env file in the root directory and add the following variables:
```bash
NODE_ENV=development
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
Replace placeholder values with your actual credentials.
### **4. Run the Server**
Start the server using the following command:
```bash
npm run server
```
The server will run on http://localhost:5000 or the port specified in your .env file.

## **Important Notes**
- **Database Connection:**  
  Ensure your MongoDB instance is accessible and the connection string is correct.  

- **Cloudinary Setup:**  
  Create a Cloudinary account and set up API keys for media uploads.  

- **Testing:**  
  Use tools like Postman to test API endpoints.  

