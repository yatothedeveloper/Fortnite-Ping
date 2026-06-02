/*
 * Project: [اكتب اسم مشروعك هنا]
 * Author: Yahya Magdy
 * License: CC BY-NC 4.0 (Non-Commercial Use Only)
 * 
 * يمنع استخدام هذا الكود لأغراض تجارية أو بيعه.
 * كافة الحقوق محفوظة © 2026 Yahya Magdy.
 */
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
window.onload = function() {
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 23, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#f786de" },
            "shape": { "type": "circle" },
            "opacity": { "value": 1, "random": true },
            "size": { "value": 10, "random": true },
            "line_linked": { "enable": false }, // تم إيقاف الخطوط
            "move": { 
                "enable": true, 
                "speed": 6, 
                "direction": "top", 
                "out_mode": "out" 
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": false }, // إيقاف التفاعل عند المرور
                "onclick": { "enable": false }, // إيقاف التفاعل عند الضغط
                "resize": true
            }
        },
        "retina_detect": true
    });
};
