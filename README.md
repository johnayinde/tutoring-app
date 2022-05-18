> API Documentation is available at : https://documenter.getpostman.com/view/11191710/UyxkmmGs

# Online Tutoring App

**Considerations :** 
* An admin login detail :
        ```{
            "email" : "omilosamuel@gmail.com",
            "password" : "wonderful"
        }```
    Trying to access a route without proper authentication would give a 403 status
* All routes require authentication,Every user must be signed in to access the routes
* Users can surf through this API documentation by making a search with keyword of funtionality required

### info : 
    title : Online tutoring app
    description : The online tutoring app API is built for the task 4 of the node js track of start.ng 2020.

    All requests and responses with this API use the JSON format.

    Authentication is with JWT tokens which are persisted as cookies to ensure good user experience. 
    Authentication is needed for all routes.Users must be signed in
    

#### Endpoints :
* **All users can retrieve a subject in a category by id**
   
 
* **All users can retrieve the subjects in a category**
    
* **All users can retrieve the categoies available**

* **All users can search for a subject by name**
   
            
* **All users can search for a subject by name**
  
            
* **All users can sign in**
  

## Tutor Routes 
* **Tutors can register to take a course in a category :**

	
				
* **Tutors can see all the subjects they registered :**

	 
	
* **Tutors can update a subject they registered :**

	
* **Tutors can delete a subject they registered :**

	
## Student Routes 
* **Students can sign up :**

	 

* **Students can book lesson :**

	 

**Students can get all tutors taking a course in a category :**


## Admin Routes :

*  **Admin can create subjects under categories 'sss',primary' and 'jss'**




**Admin can update a subject in a category by Id**




**Admin can retrieve tutors by Id**



**Admin can retrieve lessons by id**