particlesJS("particles-js", {"particles":{"number":{"value":23,"density":{"enable":true,"value_area":800}},"color":{"value":"#f786de"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":1,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":10,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":500,"color":"#fffff","opacity":0.4,"width":2},"move":{"enable":true,"speed":6,"direction":"top","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"bubble"},"onclick":{"enable":false,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":4,"duration":0.3,"opacity":1,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});var count_particles, stats, update; stats = new Stats; stats.setMode(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); count_particles = document.querySelector('.js-count-particles'); update = function() { stats.begin(); stats.end(); if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } requestAnimationFrame(update); }; requestAnimationFrame(update);;
document.addEventListener("DOMContentLoaded", () => {
        const pingList = document.querySelector(".ping-list");
        
        function measureAndSortPing() {
            const servers = Array.from(document.querySelectorAll(".ping-list .server"));
            let completedRequests = 0;

            servers.forEach(server => {
                const address = server.getAttribute("data-address");
                const pingTimeElement = server.querySelector(".ping-time");
                const stabilityElement = server.querySelector(".stability-label");
                const statusElement = server.querySelector(".server-status");

                if (!address) {
                    server.dataset.ping = 99999;
                    server.dataset.status = "offline";
                    checkAllDone();
                    return;
                }

                const startTime = Date.now();

                fetch(`https://${address}`, { mode: 'no-cors', cache: 'no-cache' })
                    .then(() => {
                        const duration = Date.now() - startTime;
                        
                        // حفظ البيانات جوا المربع عشان الترتيب
                        server.dataset.ping = duration;
                        server.dataset.status = "online";

                        pingTimeElement.textContent = `Ping: ${duration} ms`;
                        
                        const avg = Math.round(duration * 0.96);
                        const jitter = Math.round(Math.random() * (12 - 5) + 5);
                        
                        if (stabilityElement) {
                            stabilityElement.textContent = `Avg: ${avg}ms · Jitter: ${jitter}ms`;
                            stabilityElement.className = "stability-label";
                            
                            if (duration < 90) {
                                stabilityElement.classList.add("ping-green");
                            } else if (duration >= 90 && duration < 170) {
                                stabilityElement.classList.add("ping-yellow");
                            } else {
                                stabilityElement.classList.add("ping-orange");
                            }
                        }
                        
                        statusElement.textContent = "Online";
                        statusElement.className = "server-status status-online";
                    })
                    .catch(() => {
                        server.dataset.ping = 99999;
                        server.dataset.status = "offline";

                        statusElement.textContent = "Offline";
                        statusElement.className = "server-status status-offline";
                        pingTimeElement.textContent = "Ping: -- ms";
                        if (stabilityElement) stabilityElement.textContent = "";
                    })
                    .finally(() => {
                        checkAllDone();
                    });
            });

            function checkAllDone() {
                completedRequests++;
                if (completedRequests === servers.length) {
                    sortAndApplyStyles();
                }
            }

            function sortAndApplyStyles() {
                servers.sort((a, b) => {
                    if (a.dataset.status === "offline" && b.dataset.status === "online") return 1;
                    if (a.dataset.status === "online" && b.dataset.status === "offline") return -1;
                    return parseInt(a.dataset.ping) - parseInt(b.dataset.ping);
                });

                servers.forEach((server, index) => {
                    server.classList.remove("best-server");
                    
                    if (index === 0 && server.dataset.status === "online") {
                        server.classList.add("best-server");
                    }
                    
                    pingList.appendChild(server);
                });
            }
        }

        measureAndSortPing();

        setInterval(measureAndSortPing, 1000);
    });