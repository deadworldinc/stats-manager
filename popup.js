document.getElementById("buttonGetStatistic").onclick = function() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;

        return chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
            func: getStatistic,
        });
    });
}

function getStatistic() {
    let columnData = getColumnValues(3);

    const res = columnData.reduce((acc, i) => {
        if (acc.hasOwnProperty(i)) {
            acc[i] += 1;
        } else {
            acc[i] = 1;
        }
        return acc;
    }, {});

    document.head.innerHTML += `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

            button:hover {
                filter: brightness(0.9);
            }

            button:active {
                transform: scale(0.9);
            }

            button:before {
                content: '';
                position: absolute;
                width: 200px;
                height: 40px;
                background-image: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0) 20%,
                    rgba(255, 255, 255, .5),
                    rgba(255, 255, 255, 0) 80%
                );
                top: 0;
                left: -100px;
                animation: shine 5s infinite linear; /* Animation */
            }

            @keyframes shine {
                0% {left: -100px}
                20% {left: 100%}
                100% {left: 100%}
            }

            svg {
                opacity: 0.5;
                transition-duration: 250ms;
            }

            svg:hover {
                opacity: 1;
            }

            .backdrop {
                animation: fade-in 500ms forwards;
            }

             @keyframes fade-in {
                0% {opacity: 0}
                100% {opacity: 1}
            }
        </style>
    `;

    document.body.innerHTML += `
        <div id="dialogStatistic" style="position: fixed; width: 100%; height: 100%; top: 0; left: 0;">
            <div class="backdrop" style="position: absolute; width: 100%; height: 100%; background: rgb(0, 0, 0, 0.5); top: 0; left: 0; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(10px) invert(1);">
                <div style="width: 380px; background: rgb(20, 20, 20); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="padding: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); position: relative;">
                        <span style='font-family: "Inter", sans-serif; font-size: 14px; font-weight: 400; color: white;'>Подсчет статистики</span>
                        <svg onclick="dialogStatistic.parentElement.removeChild(dialogStatistic);" style="position: absolute; right: 15px; cursor: pointer; color: white;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </div>
                    <div style="padding: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        <span style='font-family: "Inter", sans-serif; font-size: 14px; font-weight: 300; color: white; opacity: 0.75;'>Ниже представлены статистические показатели по каждому из отделов:</span>
                    </div>
                    <div style="padding: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        <span style='font-family: "Inter", sans-serif; font-size: 14px; font-weight: 300; color: white; opacity: 0.75;'>${JSON.stringify(res).replaceAll(",", " шт.,\n").replaceAll(":", " отдел – ").replaceAll("{", "").replaceAll("}", "").replaceAll('"', "").replaceAll("\n отдел – 1 шт.,", "")} шт.</span>
                    </div>
                    <div style="padding: 15px;">
                        <button style='transition-duration: 250ms; position: relative; overflow: hidden; cursor: pointer; border: none; border-radius: 8px; width: 100%; height: 40px; background: linear-gradient(90deg, #73ffcd, #aeff6f); color: black; font-family: "Inter", sans-serif; font-weight: 400;' onclick="dialogStatistic.parentElement.removeChild(dialogStatistic);">Хорошо</button>
                    </div>
                </div>
            </div>
        </div>
    `;
        
    function getColumnValues(columnIndex) {
        const table = document.getElementsByTagName('table')[0];
        const values = [];
        for (let i = 0; i < table.rows.length; i++) {
            const row = table.rows[i];
            if (row.cells.length > columnIndex) {
            const cell = row.cells[columnIndex];
            if(cell){
                values.push(cell.textContent.slice(16, 18));
            }
            }
        }
        return values;
    }
}