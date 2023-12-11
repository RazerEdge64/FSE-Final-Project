# **FakeStackOverlow**

### The architecture:

On a high level, the application uses **client server architecture** with MongoDB as the database.

The **client side** of the application is segmented into distinct components, primarily divided into QnA and tags,
reflecting the two main workflows of questions and the tags in the sidebar.
The main app component serves as the root, rendering the header, sidebar, and the main content.
This content is further delineated into various sub-components, each dedicated to a specific function.

To be more elaborate:
If we imagine all the components as a tree like structure, the _**App**_ is the root which handles all the states which are used throughout the application among all components.  
Then **_Sidebar_**, **_Header_** & **_Content_** are the children components of App and they basically divide the canvas into 3 parts.
The content mainly handles the change in view among various activities by the user as the sidebar and header are constant throughout the application.
So the content contains most of the states and view logic which the application demands.

All the API calls to the server are kept in the [dataServices.js](../client/src/services/dataServices.js).  And authentication related API calls are kept in the [authServices.js](../client/src/services/authServices.js).


The **server side** of the application has numerous api calls for reading (GET requests) and creating data (POST requests).  It is majorly divided into 3 parts.
1. [questionRoutes](../server/routes/questionRoutes.js) - Handling all the API calls related to the questions.
2. [answerRoutes](../server/routes/answerRoutes.js) - Handling all the API calls related to the answers.
3. [tagRoutes](../server/routes/tagRoutes.js) - Handling all the API calls related to the tags.
4. [commentRoutes](../server/routes/commentRoutes.js) - Handling all the API calls related to the comments - related to questions & answers both. 
5. [authRoutes](../server/routes/authRoutes.js) - Handling all the API calls related to the user authentication and session. 



### **Adopting the Singleton Design Pattern:**


During development, we found ourselves frequently using console.logs across multiple files for debugging.
This observation led to the idea of incorporating the singleton design pattern for a centralized logger.
The foresight was that in the future, as we transition to using a database, a centralized logger would allow us
to simply update one 'log' function in the Logger class, as opposed to modifying individual console.logs spread
across files.

Our Logger module epitomizes the Singleton design pattern. This ensures the creation of only a single instance of
the Logger class, providing a consistent logging mechanism throughout the application. The Singleton pattern ensures
that we don't create unnecessary instances, thus guaranteeing data uniformity and optimizing resources.
As a result, our FakeStackOverflow application benefits from improved maintainability and performance,
thanks to a streamlined and resource-efficient logging approach.