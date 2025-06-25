---
layout: page
title: Gallery
permalink: /gallery/
image: 
description: Gallery and Memories of the AI Digital Twin Lab, Dong-A University of Korea
toc: false
---

---

<div class="container mt-4">
    <div class="row">
        <!-- Gallery 1 -->
        <div class="col-md-6">
            <div class="row">
                <h3 class="text-center">2025 Mr. Khanh and Mr. Gu's Graduation</h3>
            </div>
            <div id="galleryCarousel1" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner"></div>
                <a class="carousel-control-prev" href="#galleryCarousel1" role="button" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </a>
                <a class="carousel-control-next" href="#galleryCarousel1" role="button" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </a>
            </div>
        </div>
        <!-- Gallery 2 -->
        <div class="col-md-6">
            <div class="row" style="height:74px">
                <h3 class="text-center">New Event - On Going Update</h3>
            </div>
            <div id="galleryCarousel2" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner"></div>
                <a class="carousel-control-prev" href="#galleryCarousel2" role="button" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </a>
                <a class="carousel-control-next" href="#galleryCarousel2" role="button" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </a>
            </div>
        </div>
    </div>
</div>

<hr>

<script>
    const basePath  = "../images/Gallery/2025-Graduation/Spring/";
    const basePath2 = "../images/Gallery/2025-Graduation/NewEvent/";
    const imagePaths  = Array.from({ length: 5 }, (_, i) => `${basePath}0${i + 1}.jpg`);
    const imagePaths2 = Array.from({ length: 2 }, (_, i) => `${basePath2}0${i + 1}.jpg`);

    function createCarouselItems(carouselId, images) {
        const carouselInner = document.querySelector(`#${carouselId} .carousel-inner`);
        carouselInner.innerHTML = images.map((src, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${src}" class="d-block w-100" alt="Slide ${index + 1}" style="width:5934px, height:3693px">
            </div>
        `).join('');
    }

    createCarouselItems('galleryCarousel1', imagePaths);
    createCarouselItems('galleryCarousel2', imagePaths2);
</script>



<!-- Ensure Bootstrap 5 is linked -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
