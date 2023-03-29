<h1>Credential Keeping App Backend</h1>

<img src="https://user-images.githubusercontent.com/31761132/73010697-b4c12600-3e34-11ea-8216-bfe2f40856da.png" alt="NodeJS and MongoDB logos">

<p>This is a backend application for a Credential Keeping App, developed using MongoDB (mongoose), NodeJS, and TypeScript. The app has user and admin roles with the intention of adding more features in the future.</p>

<h2>Requirements</h2>

<ul>
  <li>Node.js (v12 or later)</li>
  <li>MongoDB</li>
</ul>

<h2>Installation</h2>

<ol>
  <li>Clone the repository</li>
  <li>Run <code>npm install</code> to install all the required dependencies</li>
  <li>Create a <code>.env</code> file in the root directory with the following environment variables:</li>
</ol>

<pre><code>MONGODB_URI=&lt;mongodb://localhost:27017/your-db-name&gt;
JWT_SECRET=&lt;your-secret-key&gt;
</code></pre>

<p>Make sure to replace <code>your-db-name</code> and <code>your-secret-key</code> with your own values.</p>

<ol start="4">
  <li>Run <code>npm run serve</code> to start the development server</li>
</ol>

<h2>Features</h2>

<h3>Authentication</h3>

<p>The app uses JSON Web Tokens (JWT) for user authentication. Upon successful login, the server returns a token that should be included in the headers of subsequent requests to protected routes. A user can also generate a strong password on demand using the API.</p>

<h3>Authorization</h3>

<p>The app has two roles: <code>user</code> and <code>admin</code>. User accounts can view and manage their own credentials, while admin accounts have access to all credentials.</p>

<h3>Credential Management</h3>

<p>Users can create, read, update, and delete their own credentials. Admins have the ability to manage all credentials.</p>

<h3>User account management</h3>

<p>Users can register, login and change their passwords (admins will be able to change user passwords soon). A user will have to login again and request a new token right after changing his password</p>

<h3>Client support platform</h3>

<p>Soon the client will be able to submit tickets, which then admins can read, and update the ticket's status to resolved, in progress... etc. The client will be able to access all his tickets and view their status, as well as delete tickets only when their status is resolved.</p>

<h2>API Endpoints</h2>

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Access</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/api/auth/register</td>
      <td>Register a new user</td>
       <td></td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/api/auth/login</td>
      <td>Log in with existing user credentials</td>
      <td></td>
    </tr> 
    <tr>
      <td>GET</td>
      <td>/api/auth/whoami</td>
      <td>Get the person's role</td>
       <td>client, admin</td>
    </tr>  
     <tr>
      <td>PUT</td>
      <td>/api/auth/changepassword</td>
      <td>Change user's password</td>
       <td>client, admin</td>
    </tr> 
     <tr>
      <td>POST</td>
      <td>/api/generatepassword</td>
      <td>Generate strong password</td>
       <td>client, admin</td>
    </tr>  
    <tr>
      <td>GET</td>
      <td>/api/mine?page=1&sort=-updated_At</td>
      <td>Signed in user gets his credentials</td>
       <td>client, admin</td>
    </tr> 
    <tr>
      <td>GET</td>
      <td>/api/[credential id]</td>
      <td>Get a single credential from <strong>ANY<strong> user</td>
       <td>admin</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/all?page=1&sort=-updated_At</td>
      <td>Get <strong>ALL<strong> credentials</td>
       <td>admin</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/api/auth/admin/changepassword</td>
      <td>Change <strong>ANY<strong> client's password</td>
       <td>admin</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/credential?title=Gmail</td>
      <td>User can search among his credentials</td>
       <td>client, admin</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/credential</td>
      <td>Create a new credential</td>
      <td>client, admin</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/api/:id</td>
      <td>Update an existing credential</td>
       <td>client, admin</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/api/[credential _id]</td>
      <td>Delete an existing credential</td>
       <td>client, admin</td>
    </tr>
