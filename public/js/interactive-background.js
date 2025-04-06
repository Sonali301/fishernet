// interactive-background.js
// This file contains the interactive background animation code
// Optimized for mobile devices while preserving original desktop experience

class InteractiveBackground {
    constructor(canvasId = 'canvas') {
        // Canvas setup
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas element with ID '${canvasId}' not found`);
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Mouse position
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;

        // Detect mobile device
        this.isMobile = this.detectMobile();

        // Settings - different for mobile vs desktop
        if (this.isMobile) {
            // Mobile settings
            this.pointCount = 60; // Fewer points on mobile
            this.connectionDistance = 100; // Shorter connections on mobile
            this.polygonCount = 3; // Fewer polygons on mobile
            this.mouseRadius = 70; // Smaller interaction radius on mobile
        } else {
            // Desktop settings - UNCHANGED from original
            this.pointCount = 200;
            this.connectionDistance = 150;
            this.polygonCount = 6;
            this.mouseRadius = 150;
        }

        this.isMouseMoving = false;
        this.mouseTimer = null;

        // Colors palette - UNCHANGED from original
        this.colorPalette = [
            '#FF3CAC',
            '#784BA0',
            '#2B86C5',
            '#1FB8FB',
            '#B621FE'
        ];

        // Initialize
        this.points = [];
        this.polygons = [];
        this.initPoints();
        this.initPolygons();
        this.addEventListeners();
        this.setupIdleMovement();
        this.animate();
    }

    // Detect mobile device
    detectMobile() {
        return (window.innerWidth < 768) ||
            (('ontouchstart' in window) && (window.innerWidth < 1024));
    }

    // Point class
    Point(x, y) {
        // Create standard point for desktop, or optimized for mobile
        if (this.isMobile) {
            return {
                x: x || Math.random() * this.canvas.width,
                y: y || Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 2.5, // Slightly smaller on mobile
                baseSize: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.03, // Slower on mobile
                vy: (Math.random() - 0.5) * 0.03,
                opacity: Math.random() * 0.5 + 0.3,
                connections: 0,
                highlighted: false,
                highlightStrength: 0,
                clickHighlight: 0,
                color: this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)],

                update: function(mouseX, mouseY, mouseRadius, canvas) {
                    // Move point
                    this.x += this.vx;
                    this.y += this.vy;

                    // Boundary check with bounce
                    if (this.x <= 0 || this.x >= canvas.width) {
                        this.vx *= -1;
                        this.x = Math.max(0, Math.min(this.x, canvas.width));
                    }
                    if (this.y <= 0 || this.y >= canvas.height) {
                        this.vy *= -1;
                        this.y = Math.max(0, Math.min(this.y, canvas.height));
                    }

                    // Mouse interaction
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseRadius) {
                        this.highlighted = true;
                        this.highlightStrength = 1 - (distance / mouseRadius);

                        // Subtle repulsion from mouse
                        const angle = Math.atan2(dy, dx);
                        const repulsionForce = (mouseRadius - distance) / mouseRadius * 0.02;
                        this.vx -= Math.cos(angle) * repulsionForce;
                        this.vy -= Math.sin(angle) * repulsionForce;
                    } else {
                        this.highlighted = false;
                        this.highlightStrength = Math.max(0, this.highlightStrength - 0.1);
                    }

                    // Click highlight effect fades out more slowly
                    if (this.clickHighlight > 0) {
                        this.clickHighlight -= 0.002;
                    }

                    // Update size based on highlight
                    this.size = this.baseSize + this.highlightStrength * 2 + this.clickHighlight * 3;

                    // Reset connections count for this frame
                    this.connections = 0;
                },

                draw: function(ctx) {
                    // Base point
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                    // Color based on highlight state
                    if (this.highlighted || this.clickHighlight > 0) {
                        const highlightOpacity = Math.max(this.highlightStrength, this.clickHighlight);
                        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + highlightOpacity * 0.5})`;
                    } else {
                        ctx.fillStyle = this.color;
                    }

                    ctx.fill();

                    // Add glow for highlighted points
                    if (this.highlighted || this.clickHighlight > 0) {
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);

                        const glowOpacity = (this.highlightStrength * 0.3) + (this.clickHighlight * 0.5);
                        ctx.fillStyle = `rgba(255, 255, 255, ${glowOpacity})`;
                        ctx.fill();
                    }
                }
            };
        } else {
            // ORIGINAL DESKTOP IMPLEMENTATION - Unchanged
            return {
                x: x || Math.random() * this.canvas.width,
                y: y || Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 0.5,
                baseSize: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.03,
                vy: (Math.random() - 0.5) * 0.03,
                opacity: Math.random() * 0.5 + 0.3,
                connections: 0,
                highlighted: false,
                highlightStrength: 0,
                clickHighlight: 0,
                color: this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)],

                update: function(mouseX, mouseY, mouseRadius, canvas) {
                    // Move point
                    this.x += this.vx;
                    this.y += this.vy;

                    // Boundary check with bounce
                    if (this.x <= 0 || this.x >= canvas.width) {
                        this.vx *= -1;
                        this.x = Math.max(0, Math.min(this.x, canvas.width));
                    }
                    if (this.y <= 0 || this.y >= canvas.height) {
                        this.vy *= -1;
                        this.y = Math.max(0, Math.min(this.y, canvas.height));
                    }

                    // Mouse interaction
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseRadius) {
                        this.highlighted = true;
                        this.highlightStrength = 1 - (distance / mouseRadius);

                        // Subtle repulsion from mouse
                        const angle = Math.atan2(dy, dx);
                        const repulsionForce = (mouseRadius - distance) / mouseRadius * 0.02;
                        this.vx -= Math.cos(angle) * repulsionForce;
                        this.vy -= Math.sin(angle) * repulsionForce;
                    } else {
                        this.highlighted = false;
                        this.highlightStrength = Math.max(0, this.highlightStrength - 0.05);
                    }

                    // Click highlight effect fades out more slowly
                    if (this.clickHighlight > 0) {
                        this.clickHighlight -= 0.002;
                    }

                    // Update size based on highlight
                    this.size = this.baseSize + this.highlightStrength * 2 + this.clickHighlight * 3;

                    // Reset connections count for this frame
                    this.connections = 0;
                },

                draw: function(ctx) {
                    // Base point
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                    // Color based on highlight state
                    if (this.highlighted || this.clickHighlight > 0) {
                        const highlightOpacity = Math.max(this.highlightStrength, this.clickHighlight);
                        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + highlightOpacity * 0.5})`;
                    } else {
                        ctx.fillStyle = this.color;
                    }

                    ctx.fill();

                    // Add glow for highlighted points
                    if (this.highlighted || this.clickHighlight > 0) {
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);

                        const glowOpacity = (this.highlightStrength * 0.3) + (this.clickHighlight * 0.5);
                        ctx.fillStyle = `rgba(255, 255, 255, ${glowOpacity})`;
                        ctx.fill();
                    }
                }
            };
        }
    }

    // Polygon class
    Polygon() {
        if (this.isMobile) {
            // Mobile-optimized polygon
            const vertexCount = Math.floor(Math.random() * 2) + 3; // 3-4 vertices
            const vertices = [];
            const centerX = Math.random() * this.canvas.width;
            const centerY = Math.random() * this.canvas.height;
            const rotation = Math.random() * Math.PI * 2;
            const rotationSpeed = (Math.random() - 0.5) * 0.00001; // Slower on mobile
            const size = Math.random() * 80 + 40; // Slightly smaller on mobile
            const opacity = Math.random() * 0.04 + 0.01; // Slightly more transparent
            const vx = (Math.random() - 0.5) * 0.02; // Slower on mobile
            const vy = (Math.random() - 0.5) * 0.02;
            const color = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];

            // Generate initial vertices
            for (let i = 0; i < vertexCount; i++) {
                const angle = (i / vertexCount) * Math.PI * 2 + rotation;
                const x = centerX + Math.cos(angle) * size;
                const y = centerY + Math.sin(angle) * size;
                vertices.push({
                    x,
                    y
                });
            }

            return {
                vertexCount,
                vertices,
                centerX,
                centerY,
                rotation,
                rotationSpeed,
                size,
                opacity,
                vx,
                vy,
                color,

                update: function(canvas) {
                    // Move polygon
                    this.centerX += this.vx;
                    this.centerY += this.vy;

                    // Rotate polygon
                    this.rotation += this.rotationSpeed;

                    // Boundary check with bounce
                    if (this.centerX - this.size <= 0 || this.centerX + this.size >= canvas.width) {
                        this.vx *= -1;
                    }
                    if (this.centerY - this.size <= 0 || this.centerY + this.size >= canvas.height) {
                        this.vy *= -1;
                    }

                    // Update vertices
                    for (let i = 0; i < this.vertexCount; i++) {
                        const angle = (i / this.vertexCount) * Math.PI * 2 + this.rotation;
                        this.vertices[i] = {
                            x: this.centerX + Math.cos(angle) * this.size,
                            y: this.centerY + Math.sin(angle) * this.size
                        };
                    }
                },

                draw: function(ctx) {
                    ctx.beginPath();
                    ctx.moveTo(this.vertices[0].x, this.vertices[0].y);

                    for (let i = 1; i < this.vertices.length; i++) {
                        ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
                    }

                    ctx.closePath();
                    ctx.strokeStyle = `${this.color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    ctx.fillStyle = `${this.color}${Math.floor(this.opacity * 0.3 * 255).toString(16).padStart(2, '0')}`;
                    ctx.fill();
                }
            };
        } else {
            // ORIGINAL DESKTOP IMPLEMENTATION - Unchanged
            const vertexCount = Math.floor(Math.random() * 3) + 3; // 3-5 vertices
            const vertices = [];
            const centerX = Math.random() * this.canvas.width;
            const centerY = Math.random() * this.canvas.height;
            const rotation = Math.random() * Math.PI * 2;
            const rotationSpeed = (Math.random() - 0.5) * 0.0001;
            const size = Math.random() * 100 + 50;
            const opacity = Math.random() * 0.05 + 0.02;
            const vx = (Math.random() - 0.5) * 0.02;
            const vy = (Math.random() - 0.5) * 0.02;
            const color = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];

            // Generate initial vertices
            for (let i = 0; i < vertexCount; i++) {
                const angle = (i / vertexCount) * Math.PI * 2 + rotation;
                const x = centerX + Math.cos(angle) * size;
                const y = centerY + Math.sin(angle) * size;
                vertices.push({
                    x,
                    y
                });
            }

            return {
                vertexCount,
                vertices,
                centerX,
                centerY,
                rotation,
                rotationSpeed,
                size,
                opacity,
                vx,
                vy,
                color,

                update: function(canvas) {
                    // Move polygon
                    this.centerX += this.vx;
                    this.centerY += this.vy;

                    // Rotate polygon
                    this.rotation += this.rotationSpeed;

                    // Boundary check with bounce
                    if (this.centerX - this.size <= 0 || this.centerX + this.size >= canvas.width) {
                        this.vx *= -1;
                    }
                    if (this.centerY - this.size <= 0 || this.centerY + this.size >= canvas.height) {
                        this.vy *= -1;
                    }

                    // Update vertices
                    for (let i = 0; i < this.vertexCount; i++) {
                        const angle = (i / this.vertexCount) * Math.PI * 2 + this.rotation;
                        this.vertices[i] = {
                            x: this.centerX + Math.cos(angle) * this.size,
                            y: this.centerY + Math.sin(angle) * this.size
                        };
                    }
                },

                draw: function(ctx) {
                    ctx.beginPath();
                    ctx.moveTo(this.vertices[0].x, this.vertices[0].y);

                    for (let i = 1; i < this.vertices.length; i++) {
                        ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
                    }

                    ctx.closePath();
                    ctx.strokeStyle = `${this.color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    ctx.fillStyle = `${this.color}${Math.floor(this.opacity * 0.3 * 255).toString(16).padStart(2, '0')}`;
                    ctx.fill();
                }
            };
        }
    }

    // Initialize points
    initPoints() {
        for (let i = 0; i < this.pointCount; i++) {
            this.points.push(this.Point());
        }
    }

    // Initialize polygons
    initPolygons() {
        for (let i = 0; i < this.polygonCount; i++) {
            this.polygons.push(this.Polygon());
        }
    }

    // Draw connections between points
    drawConnections() {
        // Optimize for mobile or use original desktop implementation
        if (this.isMobile) {
            // Mobile optimization: fewer connections
            const maxConnections = 3; // Limit connections on mobile

            for (let i = 0; i < this.points.length; i++) {
                // Skip points that already have many connections (optimization)
                if (this.points[i].connections >= maxConnections) continue;

                for (let j = i + 1; j < this.points.length; j++) {
                    // Skip points that already have many connections (optimization)
                    if (this.points[j].connections >= maxConnections) continue;

                    const pointA = this.points[i];
                    const pointB = this.points[j];

                    const dx = pointA.x - pointB.x;
                    const dy = pointA.y - pointB.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.connectionDistance) {
                        // Calculate opacity based on distance
                        const opacity = (1 - distance / this.connectionDistance) * 0.5;

                        // Increase connection count for both points
                        pointA.connections++;
                        pointB.connections++;

                        // Check if either point is highlighted
                        const isHighlighted = pointA.highlighted || pointB.highlighted ||
                            pointA.clickHighlight > 0 || pointB.clickHighlight > 0;

                        // Different styling based on highlight
                        if (isHighlighted) {
                            const highlightStrength = Math.max(
                                pointA.highlightStrength,
                                pointB.highlightStrength,
                                pointA.clickHighlight,
                                pointB.clickHighlight
                            );

                            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity + highlightStrength * 0.3})`;
                            this.ctx.lineWidth = 0.8 + highlightStrength;
                        } else {
                            // Use a color similar to the points
                            const color = pointA.color;
                            this.ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
                            this.ctx.lineWidth = 0.4;
                        }

                        this.ctx.beginPath();
                        this.ctx.moveTo(pointA.x, pointA.y);
                        this.ctx.lineTo(pointB.x, pointB.y);
                        this.ctx.stroke();
                    }
                }
            }
        } else {
            // ORIGINAL DESKTOP IMPLEMENTATION - Unchanged
            for (let i = 0; i < this.points.length; i++) {
                for (let j = i + 1; j < this.points.length; j++) {
                    const pointA = this.points[i];
                    const pointB = this.points[j];

                    const dx = pointA.x - pointB.x;
                    const dy = pointA.y - pointB.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.connectionDistance) {
                        // Calculate opacity based on distance
                        const opacity = (1 - distance / this.connectionDistance) * 0.5;

                        // Increase connection count for both points
                        pointA.connections++;
                        pointB.connections++;

                        // Check if either point is highlighted
                        const isHighlighted = pointA.highlighted || pointB.highlighted ||
                            pointA.clickHighlight > 0 || pointB.clickHighlight > 0;

                        // Different styling based on highlight
                        if (isHighlighted) {
                            const highlightStrength = Math.max(
                                pointA.highlightStrength,
                                pointB.highlightStrength,
                                pointA.clickHighlight,
                                pointB.clickHighlight
                            );

                            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity + highlightStrength * 0.3})`;
                            this.ctx.lineWidth = 1 + highlightStrength;
                        } else {
                            // Use a color similar to the points
                            const color = pointA.color;
                            this.ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
                            this.ctx.lineWidth = 0.5;
                        }

                        this.ctx.beginPath();
                        this.ctx.moveTo(pointA.x, pointA.y);
                        this.ctx.lineTo(pointB.x, pointB.y);
                        this.ctx.stroke();
                    }
                }
            }
        }
    }

    // Animation loop
    animate() {
        // Clear canvas with black background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw polygons
        for (const polygon of this.polygons) {
            polygon.update(this.canvas);
            polygon.draw(this.ctx);
        }

        // Update points
        for (const point of this.points) {
            point.update(this.mouseX, this.mouseY, this.mouseRadius, this.canvas);
        }

        // Draw connections between points
        this.drawConnections();

        // Draw points
        for (const point of this.points) {
            point.draw(this.ctx);
        }

        // Different animation frame handling for mobile vs desktop
        if (this.isMobile) {
            // Use timeout to limit frame rate on mobile for better performance
            setTimeout(() => {
                requestAnimationFrame(this.animate.bind(this));
            }, 1000 / 60); // Target 30fps for mobile
        } else {
            // ORIGINAL DESKTOP IMPLEMENTATION - Full 60fps
            requestAnimationFrame(this.animate.bind(this));
        }
    }

    // Add event listeners
    addEventListeners() {
        // Standard desktop event handlers with mobile consideration

        // Handle mouse movement
        window.addEventListener('mousemove', e => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            this.isMouseMoving = true;
            clearTimeout(this.mouseTimer);
            this.mouseTimer = setTimeout(() => {
                this.isMouseMoving = false;
            }, 3000);
        });

        // Handle mouse click - special handling for mobile
        window.addEventListener('click', e => {
            // Highlight points near click
            for (const point of this.points) {
                const dx = e.clientX - point.x;
                const dy = e.clientY - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouseRadius * 1.5) {
                    point.clickHighlight = 1 - (distance / (this.mouseRadius * 1.5));
                }
            }

            // Add new point at click location - with limits on mobile
            if (!this.isMobile || this.points.length < this.pointCount + 10) {
                if (Math.random() > 0.5) {
                    this.points.push(this.Point(e.clientX, e.clientY));

                    // Keep point count in check
                    if (this.points.length > this.pointCount + 20) {
                        this.points.shift();
                    }
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            // Check if device type changed (e.g., orientation change)
            const wasMobile = this.isMobile;
            this.isMobile = this.detectMobile();

            // Only reinitialize if device type changed
            if (wasMobile !== this.isMobile) {
                // Clear existing elements
                this.points = [];
                this.polygons = [];

                // Set parameters based on device type
                if (this.isMobile) {
                    this.pointCount = 60;
                    this.connectionDistance = 50;
                    this.polygonCount = 3;
                    this.mouseRadius = 150;
                } else {
                    this.pointCount = 150;
                    this.connectionDistance = 150;
                    this.polygonCount = 6;
                    this.mouseRadius = 150;
                }

                // Reinitialize
                this.initPoints();
                this.initPolygons();
            }
        });

        // Mobile touch support
        window.addEventListener('touchmove', e => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;

                this.isMouseMoving = true;
                clearTimeout(this.mouseTimer);
                this.mouseTimer = setTimeout(() => {
                    this.isMouseMoving = false;
                }, 3000);

                // Don't prevent default on touch move to allow scrolling
                if (e.target === this.canvas) {
                    e.preventDefault();
                }
            }
        }, {
            passive: false
        });

        window.addEventListener('touchstart', e => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];

                // Highlight points near touch
                for (const point of this.points) {
                    const dx = touch.clientX - point.x;
                    const dy = touch.clientY - point.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.mouseRadius * 1.5) {
                        point.clickHighlight = 1 - (distance / (this.mouseRadius * 1.5));

                        if (this.isMobile) {
                            const angle = Math.atan2(dy, dx);
                            const scatterForce = 1.3; // tweak this value for stronger/weaker scatter
                            point.vx -= Math.cos(angle) * scatterForce;
                            point.vy -= Math.sin(angle) * scatterForce;
                        }


                    }
                }



                // Add new point at touch location - limit on mobile
                if (!this.isMobile || this.points.length < this.pointCount + 10) {
                    if (Math.random() > 0.5) {
                        this.points.push(this.Point(touch.clientX, touch.clientY));

                        // Keep point count in check
                        if (this.points.length > this.pointCount + 20) {
                            this.points.shift();
                        }
                    }
                }

                // Don't prevent default on touch start to allow normal touch behavior
                if (e.target === this.canvas) {
                    e.preventDefault();
                }
            }
        }, {
            passive: false
        });
    }

    // Setup automatic movement when idle
    setupIdleMovement() {
        setInterval(() => {
            if (!this.isMouseMoving) {
                if (this.isMobile) {
                    // Gentler movement on mobile
                    this.mouseX = this.canvas.width / 2 + Math.cos(Date.now() / 10000) * this.canvas.width / 8;
                    this.mouseY = this.canvas.height / 2 + Math.sin(Date.now() / 20000) * this.canvas.height / 8;
                } else {
                    // ORIGINAL DESKTOP IMPLEMENTATION - Unchanged
                    this.mouseX = this.canvas.width / 2 + Math.cos(Date.now() / 10000) * this.canvas.width / 8;
                    this.mouseY = this.canvas.height / 2 + Math.sin(Date.now() / 20000) * this.canvas.height / 8;
                }
            }
        }, this.isMobile ? 200 : 100); // Less frequent updates on mobile
    }
}

// Export the class so it can be used in other files
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = InteractiveBackground;
} else {
    window.InteractiveBackground = InteractiveBackground;
}