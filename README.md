# CodeAlpha_Social_Media_Platform
structure of the 
mini-social-media/
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── users.js
│   ├── app.js
│   └── package.json
│
└── frontend/
    ├── index.html
    ├── styles.css
    └── app.js
How It Works: The 3 Main Parts
The application is split into three interconnected parts that all work together:

The Database (MongoDB): The brain's memory. It permanently stores all the information.

It holds tables (called "collections") for Users, Posts, and Comments.
It remembers who follows whom, who liked which post, and which comments belong to which post.
The Backend (Node.js + Express.js): The brain. It does all the thinking and processing.

It listens for requests from the web browser (e.g., "log me in", "show me the posts", "like this post").
It talks to the database to get or save data.
It handles security (logging in, protecting pages).
It sends a response back to the browser (e.g., the list of posts, a "success" message).
The Frontend (HTML, CSS, JavaScript): The face and body. What the user sees and interacts with.

HTML: The structure (the buttons, text areas, posts).
CSS: The styling (the colors, spacing, fonts).
JavaScript: The muscles. It makes the page dynamic. It takes the user's action (clicking a button), sends a request to the backend, and then updates the page with the response.

