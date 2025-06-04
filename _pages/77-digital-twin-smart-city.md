---
layout: page
title: "Digital Twin"
permalink: /research/digital-twin-smart-city
toc: true
---

* TOC
{:toc}

***

# Smart City Project 

<div style="display: flex; justify-content: center; align-items: center; height: 70vh;">
    <!-- <video width="640" height="480"  controls autoplay playsinline muted>
      <source type="video/mp4" src="https://www.youtube.com/embed/1OZ2sgi1QDI?si=C-fDZwAMn8FLYKsg">
    </video> -->
    <iframe width="560" height="315" src="https://www.youtube.com/embed/HJqI0qVst9k?autoplay=1"  allow="autoplay"></iframe>
</div>

Service Platform
--------------------

* The layered plug-in service platform for smart cities fosters innovation by allowing diverse cities to build and share services across public and private sectors. The platform's architecture features a standard API that connects various digital twin-based Smart City Operating Systems (OS) across multiple cities, facilitating seamless integration of transport, government, medical, tourism, and other services. Through a unified user experience (UX), citizens benefit from consistent, accessible services regardless of location or device.
  
* The modularity of the platform enables cities to develop and test new solutions that can be horizontally scaled to other smart cities. This standardized framework maximizes the usability of core services, supporting data linkage and expanding private services while maintaining a common platform across all cities. 
  
* The result is an efficient ecosystem where successful innovations can be rapidly implemented across different urban environments, accelerating the growth of smarter, more connected cities.

<p align="center">
  <img width="1000" data-action="zoom" src="../images/service-platform.png" alt="absolute">
  <em>Creating innovative cases of various smart cities based on a layered plug-in service platform.</em>
</p>

<p align="center">
  <img width="1000" data-action="zoom" src="../images/digital-twin-showcase.png" alt="absolute">
  <em>Building a Digital Twin testbed to demonstrate Smart City Lab-based services.</em>
</p>

City Data Management
--------------------

*

<p align="center">
  <img width="800" data-action="zoom" src="../images/CDM-data-conversion.png" alt="absolute">
  <em>3D City Data - Conversion Methodology.</em>
</p>

* The City Database Management solution, based on 3DCityDB, imports CityGML data by reading XML schemas, converting them into schema-derived classes, and storing them in a structured database. 
* An import worker pool resolves XLinks, processing CityGML objects into the database for efficient storage and retrieval. 
* Once data is in 3DCityDB, it can be accessed through OGC Web Feature Service, enabling city applications to retrieve, display, and manipulate 3D city data like buildings, bridges, and transportation networks for various urban management needs.


<p align="center">
  <img width="1000" data-action="zoom" src="../images/city-data-management-3dcitydb.png" alt="absolute">
  <em>3D City Data - City Database Management Solution.</em>
</p>