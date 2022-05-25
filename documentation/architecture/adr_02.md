# Model View Controller (MVC) folder structure 

## Context 

The structure of the repository is adapted to follow the MVC design pattern.

## Decision

The repository is restructured in the following way with the following folders:

- Controller
  -  Contains all the logic that is performed on the server 
-  Model 
  - Contains all the logic for interacting with the database 
- Views
  - Contains all the HTML files that will be displayed on the client side 
- Routes    
  - Contains the routes for all the different pages as well as the end points for the API

## Status

Accepted

## Consequences

These architectural changes allow for better modularization, and testing of code as well as easier collaboration. 