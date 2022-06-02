# MongoDB

## Context

Logins and player action logs must be stored persistently and securely. MongoDB and MySQL were evaluated as possibilities.

## Decision

MongoDB is chosen as the database. As a no-SQL database, it is faster than its SQL counterparts. In the long term will be better for scalability, especially as player logs grow larger.

The Mongoose library is used to interface with MongoDB.

The database is stored on MongoDB Cloud Atlas.

## Status

Accepted

## Consequences

This decision directly applies to the storage of user login details and player action logs. It is preferred any future features that require persistent storage also utilise MongoDB unless there is a strong reason to use something else. 