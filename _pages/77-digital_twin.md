---
layout: page
title: "Digital Twin"
permalink: /research/digital_twin
toc: true
---

* TOC
{:toc}

***

# Smart City Project 

<!-- <div align="center">
    <video width="1000px" height="500px" title="Smart City" autoplays muted controls>
      <source src="https://dongaackr-my.sharepoint.com/personal/2371049_donga_ac_kr/_layouts/15/embed.aspx?UniqueId=ede8ff0e-c716-4f0d-8e63-6ad99bae6e89&embed=%7B%22af%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create" type="video/mp4">
    </video>
</div> -->
<div style="max-width: 1000px"><div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe src="https://dongaackr-my.sharepoint.com/personal/2371049_donga_ac_kr/_layouts/15/embed.aspx?UniqueId=ede8ff0e-c716-4f0d-8e63-6ad99bae6e89&embed=%7B%22af%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create" width="1000" height="500" frameborder="0" scrolling="no" allowfullscreen title="SmartCity_v3.mp4" style="border:none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: 100%; max-width: 100%;"></iframe></div></div>

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