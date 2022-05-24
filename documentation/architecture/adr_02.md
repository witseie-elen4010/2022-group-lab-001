# Socket.io

## Context

The web-app must facilitate a way for players to communicate through the browser in real time. Socket.io was chosen for this. It makes use of web sockets.

## Decision

Socket.io enables real-time bidirectional event-based communication. When a player generates a code, makes a move and other events, socket.io can facilitate sending information between the server and clients, as well as between clients. In this way players can share variables and see real-time updates in the same html page. Rooms can be created and session can be shared, to allow for scalability and many different people playing different games at once.

## Status

Accepted

## Consequences

This can be changed if necessary. However, with much research, it appears to be a valid api to utilise to approach a multiplayer game interface.
